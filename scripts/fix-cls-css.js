const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.antigravity') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles('.');
let modifiedCount = 0;
const modifiedList = [];

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Match:
  // <link rel="stylesheet" href="...tailwind.min.css" media="print" onload="this.media='all'">
  // optionally followed by <noscript><link rel="stylesheet" href="...tailwind.min.css"></noscript>
  const regex = /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*tailwind[^"']*\.css[^"']*)["']\s+media=["']print["'][^>]*>\s*(<noscript>\s*<link\s+rel=["']stylesheet["']\s+href=["'][^"']*tailwind[^"']*\.css[^"']*["']\s*\/?>\s*<\/noscript>)?/gi;

  content = content.replace(regex, (match, href) => {
    return `<link rel="stylesheet" href="${href}">`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    modifiedList.push(filePath);
  }
}

console.log(`Successfully replaced async Tailwind with standard sync load in ${modifiedCount} files:`);
modifiedList.forEach(f => console.log(`  - ${f}`));
