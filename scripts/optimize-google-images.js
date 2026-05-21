const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.github',
  '_original_assets_backup',
  'scripts'
];

function processFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // 1. Meta tags (keep as jpeg/png, no webp -rw, but size to 1200 for social previews)
  const metaRegex = /(<meta\s+[^>]*content=["'])(https:\/\/lh3\.googleusercontent\.com\/[^\s"'\)\`=]+)(?:=[wW]\d+(?:-[rR][wW])?)?(["'])/gi;
  if (metaRegex.test(content)) {
    content = content.replace(metaRegex, (match, prefix, baseUrl, suffix) => {
      hasChanges = true;
      return `${prefix}${baseUrl}=w1200${suffix}`;
    });
  }

  // 2. Preload tags (should match the hero image URL: =w1200-rw)
  const preloadRegex = /(<link\s+[^>]*rel=["']preload["'][^>]*href=["'])(https:\/\/lh3\.googleusercontent\.com\/[^\s"'\)\`=]+)(?:=[wW]\d+(?:-[rR][wW])?)?(["'])/gi;
  if (preloadRegex.test(content)) {
    content = content.replace(preloadRegex, (match, prefix, baseUrl, suffix) => {
      hasChanges = true;
      return `${prefix}${baseUrl}=w1200-rw${suffix}`;
    });
  }

  // 3. Background images in style attribute or CSS
  // Match url('https://lh3.googleusercontent.com/...')
  const bgRegex = /url\((['"]?)(https:\/\/lh3\.googleusercontent\.com\/[^\s"'\)\`=]+)(?:=[wW]\d+(?:-[rR][wW])?)?\1\)/gi;
  if (bgRegex.test(content)) {
    content = content.replace(bgRegex, (match, quote, baseUrl) => {
      hasChanges = true;
      // Decide width: is it footer background? Or hero background?
      let width = '1200';
      if (relativePath.includes('footer.js')) {
        width = '800';
      }
      return `url(${quote}${baseUrl}=w${width}-rw${quote})`;
    });
  }

  // 4. Img tags
  // Match <img ... src="https://lh3.googleusercontent.com/..." ...>
  // We match it and handle cases where src might be followed or preceded by other attributes
  const imgRegex = /(<img\s+[^>]*src=["'])(https:\/\/lh3\.googleusercontent\.com\/[^\s"'\)\`=]+)(?:=[wW]\d+(?:-[rR][wW])?)?(["'])([^>]*)/gi;
  if (imgRegex.test(content)) {
    content = content.replace(imgRegex, (match, prefix, baseUrl, quote, rest) => {
      hasChanges = true;
      // Determine if it is a hero image or lazy-loaded card
      // If it has loading="lazy" (either in prefix or rest), it's a lazy image
      const isLazy = prefix.includes('loading="lazy"') || rest.includes('loading="lazy"');
      
      // Let's choose width
      let width = '1200'; // Default for above-the-fold
      if (isLazy) {
        width = '800';
      }
      return `${prefix}${baseUrl}=w${width}-rw${quote}${rest}`;
    });
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Optimized Google images in: ${relativePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(file)) {
        walk(fullPath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.html' || ext === '.js') {
        processFile(fullPath);
      }
    }
  });
}

console.log("Starting Google User Content image optimization...");
walk(SRC_DIR);
console.log("Optimization complete!");
