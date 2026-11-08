const fs = require('fs');
const { NodeVM } = require('vm');

const content = fs.readFileSync('casas-steel-framing/capas-muro-tabique-3d/index.html', 'utf8');
const s = content.indexOf('<script type="module"');
const e = content.indexOf('</script>', s);
const code = content.slice(s + '<script type="module" data-cfasync="false">'.length, e);
console.log('Script length:', code.length);

try {
  // Use AsyncFunction constructor to allow top-level await and imports
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  new AsyncFunction(code);
  console.log('Syntax check: SUCCESS, valid JS without any syntax errors!');
} catch (err) {
  console.error('Syntax error detected:', err.message);
  process.exit(1);
}
