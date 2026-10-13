const fs = require('node:fs');
const path = require('node:path');
const { validatePackage } = require('../validator/index.cjs');

const base = path.resolve(__dirname, '../examples/acme-corp');
const files = {};
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(absolute);
    else if ((entry.name.endsWith('.md') || entry.name.endsWith('.json')) && entry.name !== 'DESIGN.md') {
      files[absolute.slice(base.length)] = fs.readFileSync(absolute, 'utf8');
    }
  }
}
collect(path.join(base, '.well-known'));
const result = validatePackage(files);
console.log(JSON.stringify({ example: 'ACME Corporation', files: Object.keys(files).length, ...result }, null, 2));
if (!result.valid) process.exitCode = 1;
