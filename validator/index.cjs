// BCP 2.0 reference structural validator. It never approves or rewrites content.
const Ajv = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');
const yaml = require('js-yaml');
const { createHash } = require('node:crypto');
const frontmatterSchema = require('../schema/2.0/frontmatter.schema.json');
const claimsSchema = require('../schema/2.0/claims.schema.json');
const deliverySchema = require('../schema/2.0/delivery.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const frontmatter = ajv.compile(frontmatterSchema);
const claims = ajv.compile(claimsSchema);
const delivery = ajv.compile(deliverySchema);
const ROOT = '/.well-known/brand.md';
const BASE = '/.well-known/brand/';
const REQUIRED_FILES = Object.freeze({ [ROOT]: 'root', ...Object.fromEntries(
  ['voice', 'values', 'boundaries', 'claims', 'representation', 'visual', 'onboarding']
    .map(name => [BASE + name + '.md', name])) });
const pathPattern = new RegExp(deliverySchema.properties.available_paths.items.pattern);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const result = errors => ({ valid: errors.length === 0, errors,
  limitations: 'Structural conformance only; no factual, legal, client-ingestion or cryptographic-signature verification.' });

function validateSchema(validate, value, label, errors) {
  if (!validate(value)) errors.push(...validate.errors.map(e => `${label}${e.instancePath}: ${e.message}`));
}

function parseYaml(text) {
  // JSON_SCHEMA preserves dates as strings and does not enable YAML merge tags.
  // Duplicate mapping keys throw instead of silently replacing prior values.
  return yaml.load(text, { schema: yaml.JSON_SCHEMA, maxAliasCount: 50 });
}

function deprecated(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  return Object.keys(value).some(k => k === 'agent_first_action' || deprecated(value[k], seen));
}

function parseDocument(path, text, errors) {
  if (typeof text !== 'string' || !text.trim()) { errors.push(`${path}: missing content`); return null; }
  if (text.startsWith('\uFEFF')) errors.push(`${path}: UTF-8 BOM is forbidden`);
  if (Buffer.byteLength(text) > 1024 * 1024) { errors.push(`${path}: reference validator 1 MiB safety limit exceeded`); return null; }
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) { errors.push(`${path}: missing YAML frontmatter`); return null; }
  try {
    const data = parseYaml(match[1]);
    validateSchema(frontmatter, data, path, errors);
    if (deprecated(data)) errors.push(`${path}: agent_first_action declaration is forbidden`);
    const body = text.slice(match[0].length);
    if (!body.trim()) errors.push(`${path}: missing body; record explicit gaps where content is unknown`);
    const blocks = [...body.matchAll(/^ {0,3}(`{3,}|~{3,})ya?ml[^\S\r\n]*\r?\n([\s\S]*?)^ {0,3}\1[^\S\r\n]*(?:\r?\n|$)/gmi)];
    const structured = [];
    for (const block of blocks) {
      const value = parseYaml(block[2]);
      if (deprecated(value)) errors.push(`${path}: agent_first_action declaration is forbidden`);
      structured.push(value);
    }
    return { data, body, structured };
  } catch (error) { errors.push(`${path}: invalid YAML: ${error.message}`); return null; }
}

function validatePackage(files) {
  const errors = [];
  if (!files || typeof files !== 'object' || Array.isArray(files)) return result(['package: expected canonical-path-to-content object']);
  for (const path of Object.keys(REQUIRED_FILES)) if (!Object.hasOwn(files, path)) errors.push(`${path}: required file missing`);
  const documents = new Map();
  for (const [path, text] of Object.entries(files)) {
    if (!pathPattern.test(path) || path.includes('/../') || path.includes('/./')) { errors.push(`${path}: unsafe or unsupported file path`); continue; }
    // DESIGN.md is an external projection with its own contract, not BCP frontmatter.
    if (path === '/.well-known/DESIGN.md') continue;
    if (path.endsWith('.json')) {
      try { JSON.parse(text); } catch { errors.push(`${path}: invalid JSON`); }
      continue;
    }
    const parsed = parseDocument(path, text, errors);
    if (!parsed) continue;
    documents.set(path, parsed);
    const expected = REQUIRED_FILES[path] ?? (path === BASE + 'voice/anti-ai.md' ? 'anti_ai' : null);
    if (expected && parsed.data?.file_type !== expected) errors.push(`${path}: expected file_type ${expected}`);
    if (path !== ROOT) {
      const parent = path === BASE + 'voice/anti-ai.md' ? BASE + 'voice.md' : ROOT;
      const actual = referencePath(parsed.data?.parent);
      if (actual !== parent) errors.push(`${path}: expected parent ${parent}`);
    }
    if (parsed.data?.file_type === 'claims') {
      const data = {};
      for (const block of parsed.structured) {
        if (!block || typeof block !== 'object' || Array.isArray(block)) { errors.push(`${path}: claims YAML must be a mapping`); continue; }
        for (const [section, records] of Object.entries(block)) {
          if (Object.hasOwn(data, section)) errors.push(`${path}: duplicate claims section ${section}`);
          data[section] = records;
        }
      }
      validateSchema(claims, data, path + ' claims', errors);
    }
  }
  const root = documents.get(ROOT)?.data;
  if (root && typeof root === 'object') {
    const declared = root.daughter_files;
    if (declared && typeof declared === 'object' && !Array.isArray(declared)) {
      const paths = Object.values(declared).map(referencePath);
      if (new Set(paths).size !== paths.length) errors.push('root: duplicate daughter reference');
      for (const path of paths) if (!Object.hasOwn(files, path)) errors.push(`root: declared daughter missing: ${path}`);
      for (const path of documents.keys()) if (path !== ROOT && !paths.includes(path)) errors.push(`root: undeclared daughter: ${path}`);
      if (root.publication_profile === 'registry_backed' && Object.values(declared).some(value => typeof value !== 'string' || !value.startsWith('https://'))) errors.push('root: registry_backed daughter references must be absolute HTTPS');
    }
  }
  return result(errors);
}

function referencePath(reference) {
  if (typeof reference !== 'string') return null;
  if (reference.startsWith('/')) return reference;
  try {
    const url = new URL(reference);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return null;
    // A Registry handle prefix is allowed, but no suffix-only guessing beyond
    // the explicit well-known path boundary is permitted.
    const offset = url.pathname.indexOf('/.well-known/');
    return offset >= 0 ? url.pathname.slice(offset) : null;
  } catch { return null; }
}

function validateDelivery(value) {
  const errors = [];
  validateSchema(delivery, value, 'delivery', errors);
  if (!value || !Array.isArray(value.files) || !Array.isArray(value.available_paths)) return result(errors);
  const paths = value.files.map(f => f?.path);
  if (new Set(paths).size !== paths.length) errors.push('delivery: duplicate returned path');
  if (value.response_scope === 'full_tree' && JSON.stringify([...paths].sort()) !== JSON.stringify([...value.available_paths].sort())) errors.push('delivery: full_tree inventory mismatch');
  if (['root', 'path'].includes(value.response_scope) && (paths.length !== 1 || paths[0] !== value.path)) errors.push('delivery: requested-file identity mismatch');
  for (const file of value.files) {
    if (!value.available_paths.includes(file?.path)) errors.push(`delivery: returned path is outside publication: ${file?.path}`);
    if (typeof file?.content === 'string' && file.sha256 !== sha256(file.content)) errors.push(`delivery: source hash mismatch: ${file.path}`);
  }
  return result(errors);
}

module.exports = { REQUIRED_FILES, validatePackage, validateDelivery, sha256, parseYaml };
