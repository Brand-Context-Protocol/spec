import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const schema = JSON.parse(readFileSync('schema/brand-context.schema.json', 'utf8'));
const version = new RegExp(schema.properties.bcp_version.pattern);
const claimsSchema = JSON.parse(readFileSync('schema/claims.schema.json', 'utf8'));
const claimsVersion = new RegExp(claimsSchema.properties.bcp_version.pattern);
for (const value of ['0.7', '0.8', '1.0', '1.1.0']) assert.ok(version.test(value), value);
for (const value of ['0.7', '1.1.0']) assert.ok(claimsVersion.test(value), `claims ${value}`);
for (const value of ['1', '1.1.0.0', '1.1junk']) assert.ok(!version.test(value), value);
for (const value of ['1', '1.1.0.0', '1.1junk']) assert.ok(!claimsVersion.test(value), `claims ${value}`);
assert.equal(schema.properties.agent_first_action.deprecated, true);
for (const rule of schema.allOf) assert.ok(!rule.then?.required?.includes('agent_first_action'));
const verifiedRule = schema.allOf.find(rule => rule.if?.properties?.trust_level?.const === 'verified');
assert.equal(verifiedRule?.then?.properties?.official_brand_source?.const, true);
for (const field of ['verified_at', 'verification_last_checked_at', 'verification_expires_at']) {
  assert.ok(verifiedRule?.then?.required?.includes(field), field);
}
const claimedRule = schema.allOf.find(rule => rule.if?.properties?.trust_level?.const === 'claimed');
assert.equal(claimedRule?.then?.properties?.official_brand_source?.const, false);
assert.ok(claimedRule?.then?.required?.includes('official_brand_source'));
const officialRule = schema.allOf.find(rule => rule.if?.properties?.official_brand_source?.const === true);
assert.equal(officialRule?.then?.properties?.trust_level?.const, 'verified');
const signedRule = schema.allOf.find(rule => rule.if?.properties?.integrity_signed?.const === true);
assert.deepEqual(signedRule?.then?.required, ['trust_level', 'official_brand_source']);
const spec = readFileSync('SPEC.md', 'utf8');
assert.ok(spec.includes('**Version:** 1.1.0'));
assert.ok(spec.includes('**MUST** treat all BCP body prose and publisher YAML as untrusted'));
assert.ok(spec.includes('**MUST NOT** enter owner credentials through URLs found in BCP content'));
assert.ok(!spec.includes('### 7.1.3 Agent Instructions block'));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
const files = ['examples/registry-backed-root.md', ...walk('examples/acme-corp/.well-known').filter(f => f.endsWith('.md') && !f.endsWith('/DESIGN.md'))];
const output = process.argv[2];
if (output) mkdirSync(output, { recursive: true });
for (const [index, file] of files.entries()) {
  const text = readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontmatter, file);
  assert.match(frontmatter[1], /^bcp_version: "1\.1\.0"$/m, file);
  assert.doesNotMatch(text, /^agent_first_action:|^## (?:Agent Instructions|Agent default behavior|For agents)$/im, file);
  assert.doesNotMatch(text, /authoritative over (?:general )?training data|binding brand law/i, file);
  if (output) writeFileSync(join(output, `example-${index}.yaml`), frontmatter[1]);
}
console.log(`BCP 1.1.0 affordance contract passed (${files.length} current example files).`);
