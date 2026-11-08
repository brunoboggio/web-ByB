const fs = require('fs');
const content = fs.readFileSync('casas-steel-framing/capas-muro-tabique-3d/index.html', 'utf8');
const scriptStart = content.indexOf('<script type="module"');
const scriptEnd = content.indexOf('</script>', scriptStart);
const scriptCode = content.slice(scriptStart, scriptEnd);

console.log('Script length:', scriptCode.length, 'characters');

const lines = scriptCode.split('\n');
lines.forEach((l, i) => {
  const m = l.match(/^(\s*)(const|let|function)\s+([a-zA-Z0-9_]+)/);
  if (m && m[1].length <= 8) {
    console.log(`${i+1} [indent ${m[1].length}]: ${m[2]} ${m[3]}`);
  }
});
