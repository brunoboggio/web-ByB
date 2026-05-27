/**
 * generate-srcsets.js
 * Genera versiones responsivas de las imágenes locales críticas:
 *   - Logo 1.webp: 2048x2048 → Logo-48w.webp (48px), Logo-96w.webp (96px)
 *   - casa-country/hero.webp → 400w, 800w, 1200w
 *   - casas-steel-framing/hero.webp → 400w, 800w, 1200w
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');

const tasks = [
  // Logo: de 2048x2048 reducir drásticamente
  {
    src: path.join(ROOT, 'Logo 1.webp'),
    outputs: [
      { file: path.join(ROOT, 'Logo-48w.webp'),  width: 48  },
      { file: path.join(ROOT, 'Logo-96w.webp'),  width: 96  },
    ],
  },
  // Casa Country hero
  {
    src: path.join(ROOT, 'casa-country', 'hero.webp'),
    outputs: [
      { file: path.join(ROOT, 'casa-country', 'hero-400w.webp'),  width: 400  },
      { file: path.join(ROOT, 'casa-country', 'hero-800w.webp'),  width: 800  },
      { file: path.join(ROOT, 'casa-country', 'hero-1200w.webp'), width: 1200 },
    ],
  },
  // Casas Steel Framing hero
  {
    src: path.join(ROOT, 'casas-steel-framing', 'hero.webp'),
    outputs: [
      { file: path.join(ROOT, 'casas-steel-framing', 'hero-400w.webp'),  width: 400  },
      { file: path.join(ROOT, 'casas-steel-framing', 'hero-800w.webp'),  width: 800  },
      { file: path.join(ROOT, 'casas-steel-framing', 'hero-1200w.webp'), width: 1200 },
    ],
  },
];

async function run() {
  console.log('🔧 Generando versiones responsivas de imágenes críticas...\n');

  for (const task of tasks) {
    if (!fs.existsSync(task.src)) {
      console.warn(`  ⚠️  Fuente no encontrada: ${task.src}`);
      continue;
    }

    const meta = await sharp(task.src).metadata();
    console.log(`📷 ${path.relative(ROOT, task.src)} (${meta.width}×${meta.height}px, ${(fs.statSync(task.src).size / 1024).toFixed(1)} KB)`);

    for (const out of task.outputs) {
      // Skip if output already is smaller than requested width
      if (meta.width && meta.width <= out.width) {
        // Still create it as a copy (resized to keep ratio)
      }

      await sharp(task.src)
        .resize({ width: out.width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(out.file);

      const outSize = (fs.statSync(out.file).size / 1024).toFixed(1);
      console.log(`   ✅  ${path.relative(ROOT, out.file)} → ${outSize} KB`);
    }
    console.log('');
  }

  console.log('✅ Generación de srcsets completada.');
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
