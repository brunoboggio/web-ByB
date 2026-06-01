/**
 * minify-components.js
 * Minifies header.js and footer.js using Terser (must be installed as dev dep).
 * Produces proper header.min.js and footer.min.js.
 *
 * Usage:
 *   node scripts/minify-components.js
 */

const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS = path.join(ROOT, 'components');

const FILES = [
  { src: 'header.js', out: 'header.min.js' },
  { src: 'footer.js', out: 'footer.min.js' },
];

const TERSER_OPTIONS = {
  compress: {
    drop_console: false,   // keep console.warn for debug
    passes: 2,
  },
  mangle: {
    toplevel: false,       // keep top-level names (IIFE)
  },
  format: {
    comments: false,       // strip all comments
  },
};

(async () => {
  for (const { src, out } of FILES) {
    const srcPath = path.join(COMPONENTS, src);
    const outPath = path.join(COMPONENTS, out);

    const code = fs.readFileSync(srcPath, 'utf8');
    const originalSize = Buffer.byteLength(code, 'utf8');

    try {
      const result = await minify(code, TERSER_OPTIONS);
      const minSize = Buffer.byteLength(result.code, 'utf8');
      const saving = (((originalSize - minSize) / originalSize) * 100).toFixed(1);

      fs.writeFileSync(outPath, result.code, 'utf8');
      console.log(
        `  ✓  ${src} → ${out}` +
        `  (${(originalSize / 1024).toFixed(1)} KB → ${(minSize / 1024).toFixed(1)} KB, −${saving}%)`
      );
    } catch (err) {
      console.error(`  ✗  Failed to minify ${src}:`, err.message);
      // Fallback: copy as-is so the site still works
      fs.copyFileSync(srcPath, outPath);
      console.log(`       Copied ${src} to ${out} as fallback (no minification).`);
    }
  }

  console.log('\n✅ Component minification complete.');
})();
