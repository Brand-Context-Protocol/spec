const fs = require('node:fs');
const { validatePackage, validateDelivery } = require('./index.cjs');
const [mode, path] = process.argv.slice(2);
if (!['package', 'delivery'].includes(mode) || !path) {
  console.error('Usage: node validator/cli.cjs package|delivery <json-file>');
  process.exitCode = 2;
} else {
  try {
    const result = (mode === 'package' ? validatePackage : validateDelivery)(JSON.parse(fs.readFileSync(path, 'utf8')));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.valid ? 0 : 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
