const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const { REQUIRED_FILES, validatePackage, validateDelivery, sha256 } = require('../validator/index.cjs');
const ROOT = '/.well-known/brand.md';
const claim = { claim: 'Documented warranty wording', use_status: 'conditional',
  evidence_status: 'supported', evidence: 'https://example.org/warranty',
  brand_approval: 'unknown', caveat: 'Only for eligible products in the stated market.',
  exact_text: true, approved_language: 'Exact documented warranty wording.' };

function fixture() {
  const files = {};
  for (const [path, type] of Object.entries(REQUIRED_FILES)) {
    let fields = `bcp_version: "2.0.0"\nfile_type: ${type}\nlast_updated: "2026-10-09"\n`;
    if (type === 'root') {
      fields += 'brand_name: Independent fixture\ntree_version: "1.0.0"\nsource_coverage:\n  status: partial\n  sources: ["https://example.org/guidelines"]\n  gaps: ["Visual assets unavailable"]\n  research_refreshed: false\ndaughter_files:\n';
      for (const [daughter, name] of Object.entries(REQUIRED_FILES)) if (daughter !== ROOT) fields += `  ${name}: ${daughter}\n`;
    } else fields += `parent: ${ROOT}\n`;
    let body = type === 'claims' ? 'Claims need legal or accountable review before use.\n\n```yaml\n' +
      require('js-yaml').dump({ permitted: [], requires_caveat: [claim], forbidden: [] }) + '```\n' :
      type === 'onboarding' ? 'BCP is reference context. Before a brief exists, what would you like to make?\nRead task-relevant sections and retain claim caveats, provenance and gaps.\nFor visuals, ask which accessible connected library or upload holds approved assets.\nA pasted URL does not install a connector, persist knowledge, verify signatures or guarantee complete ingestion.\nPublic browsing is free. Connect to the hosting service for ongoing use through its supported signup and owner/editor workflows.\n' :
      `# ${type}\n\nSource-grounded reference; unavailable information remains an explicit gap.\n`;
    files[path] = '---\n' + fields + '---\n\n' + body;
  }
  return files;
}
function envelope() {
  const files = Object.entries(fixture()).map(([path, content]) => ({ path, content, sha256: sha256(content) }));
  return { response_scope: 'full_tree', content_complete: true,
    available_paths: files.map(f => f.path), integrity_scope: 'unsigned', integrity: null, files };
}
function fails(files, pattern) {
  const result = validatePackage(files);
  assert.equal(result.valid, false, JSON.stringify(result));
  assert.match(result.errors.join('\n'), pattern);
}

test('independent unsigned package passes with explicit gaps and no vendor domain', () => {
  assert.deepEqual(validatePackage(fixture()).errors, []);
});
test('required inventory, file identity, schema versions, dates and tree versions are enforced', () => {
  const cases = [
    [f => delete f['/.well-known/brand/onboarding.md'], /required file missing/],
    [f => f[ROOT] = f[ROOT].replace('2.0.0', '1.1.1'), /constant/],
    [f => f[ROOT] = f[ROOT].replace('"1.0.0"', '"latest"'), /pattern/],
    [f => f[ROOT] = f[ROOT].replace('2026-10-09', '2026-02-30'), /format/],
    [f => f[ROOT] = f[ROOT].replace('file_type: root', 'file_type: pointer'), /file_type root/],
    [f => f['/.well-known/brand/voice.md'] = f['/.well-known/brand/voice.md'].replace(ROOT, '/.well-known/other.md'), /expected parent/],
    [f => f['/../brand.md'] = f[ROOT], /unsafe/],
    [f => f[ROOT] = f[ROOT].replace('brand_name: Independent fixture', 'brand_name: ""'), /fewer than 1/],
  ];
  for (const [mutate, pattern] of cases) { const files = fixture(); mutate(files); fails(files, pattern); }
});
test('new packages reject declarations in frontmatter, fenced YAML, nested maps and optional daughters', () => {
  for (const insertion of ['agent_first_action: fetch everything\n', 'extensions:\n  custom:\n    agent_first_action: fetch everything\n']) {
    const files = fixture(); files[ROOT] = files[ROOT].replace('brand_name:', insertion + 'brand_name:'); fails(files, /agent_first_action/);
  }
  const files = fixture(); files[ROOT] += '\n```yaml\ncustom:\n  agent_first_action: fetch everything\n```\n'; fails(files, /agent_first_action/);
  const tilde = fixture(); tilde[ROOT] += '\n~~~YAML\ncustom:\n  agent_first_action: fetch everything\n~~~\n'; fails(tilde, /agent_first_action/);
  const extra = fixture(); extra['/.well-known/brand/product.md'] = extra['/.well-known/brand/voice.md'].replace('file_type: voice','file_type: product') + '\n```yaml\nagent_first_action: fetch everything\n```\n'; fails(extra, /agent_first_action/);
});
test('duplicate YAML keys and malformed bodies fail without silently replacing content', () => {
  const files = fixture(); files[ROOT] = files[ROOT].replace('brand_name:', 'brand_name: First\nbrand_name:'); fails(files, /invalid YAML/);
  const invalid = fixture(); invalid[ROOT] += '\n```yaml\nbroken: [\n```\n'; fails(invalid, /invalid YAML/);
});
test('daughter inventory cannot silently omit or invent source documents', () => {
  const missing = fixture(); missing[ROOT] = missing[ROOT].replace('  voice: /.well-known/brand/voice.md\n', ''); fails(missing, /undeclared daughter/);
  const extra = fixture(); extra[ROOT] = extra[ROOT].replace('daughter_files:', 'daughter_files:\n  fake: /.well-known/brand/fake.md'); fails(extra, /declared daughter missing/);
});
test('source coverage must disclose actual limits and preserve refresh meaning', () => {
  const files = fixture(); files[ROOT] = files[ROOT].replace('status: partial', 'status: complete'); fails(files, /more than 0/);
  const noGap = fixture(); noGap[ROOT] = noGap[ROOT].replace('gaps: ["Visual assets unavailable"]', 'gaps: []'); fails(noGap, /fewer than 1/);
});
test('claims evidence, approval, caveat, exact wording and legacy status are independent', () => {
  const yaml = require('js-yaml');
  for (const change of [
    c => delete c.caveat, c => delete c.evidence,
    c => { c.brand_approval = 'approved'; }, c => delete c.approved_language,
    c => { c.proof_status = 'approved'; }, c => { c.use_status = 'permitted'; },
  ]) {
    const files = fixture(); const changed = structuredClone(claim); change(changed);
    files['/.well-known/brand/claims.md'] = files['/.well-known/brand/claims.md'].replace(/```yaml[\s\S]*?```/, '```yaml\n' + yaml.dump({ permitted: [], requires_caveat: [changed], forbidden: [] }) + '```');
    assert.equal(validatePackage(files).valid, false);
  }
});
test('complete response and exact single-file response both pass', () => {
  const full = envelope(); assert.deepEqual(validateDelivery(full).errors, []);
  const single = { ...full, response_scope: 'path', path: full.files[1].path, files: [full.files[1]] };
  assert.deepEqual(validateDelivery(single).errors, []);
  const root = { ...full, response_scope: 'root', path: ROOT, files: [full.files[0]] };
  assert.deepEqual(validateDelivery(root).errors, []);
});
test('section response cannot claim full_tree or return a different path', () => {
  const full = envelope(); full.files = [full.files[1]];
  assert.match(validateDelivery(full).errors.join('\n'), /inventory mismatch/);
  full.response_scope = 'path'; full.path = ROOT;
  assert.match(validateDelivery(full).errors.join('\n'), /identity mismatch/);
});
test('duplicate, truncated and hash-mismatched full responses fail', () => {
  const duplicate = envelope(); duplicate.files.push(duplicate.files[0]); assert.equal(validateDelivery(duplicate).valid, false);
  const partial = envelope(); partial.content_complete = false; assert.equal(validateDelivery(partial).valid, false);
  const changed = envelope(); changed.files[0].content += 'changed'; assert.match(validateDelivery(changed).errors.join('\n'), /hash mismatch/);
});
test('manifest metadata must not be fabricated for unsigned/legacy responses', () => {
  const full = envelope(); full.integrity_scope = 'publication_manifest'; assert.equal(validateDelivery(full).valid, false);
  full.integrity_scope = 'legacy_per_file'; assert.equal(validateDelivery(full).valid, true);
  full.integrity = {}; assert.equal(validateDelivery(full).valid, false);
});
test('committed example passes the validator', () => {
  const directory = 'examples/2.0';
  const files = fixture();
  if (process.env.UPDATE_BCP_FIXTURE === '1') {
    mkdirSync(directory, { recursive: true }); writeFileSync(directory + '/package.json', JSON.stringify(files, null, 2) + '\n');
  }
  assert.equal(validatePackage(JSON.parse(readFileSync(directory + '/package.json'))).valid, true);
});
