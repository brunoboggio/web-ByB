const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetImages = [
  // Blog Hero Images
  'blog/ampliacion-planta-alta-steel-framing-tucuman/hero.webp',
  'blog/construccion-llave-en-mano-vs-administracion-tucuman/hero.webp',
  'blog/construir-pileta-hormigon-vs-fibra-tucuman/hero.webp',
  'blog/mejores-constructoras-casas-country-tucuman/hero.webp',
  'blog/mejores-constructoras-yerba-buena/hero.webp',
  'blog/mejores-empresas-construccion-tucuman/hero.webp',
  'blog/mejores-empresas-refacciones-remodelaciones-tucuman/hero.webp',
  'blog/mejores-empresas-steel-framing-tucuman/hero.webp',

  // Blog In-Content Heavy Images
  'blog/ampliacion-planta-alta-steel-framing-tucuman/montaje-planta-alta.webp',
  'blog/mejores-empresas-construccion-tucuman/comparativa-detalle.webp',
  'blog/mejores-constructoras-casas-country-tucuman/obra-country.webp',
  'blog/mejores-constructoras-yerba-buena/estudio-arquitectura.webp',
  'blog/mejores-empresas-steel-framing-tucuman/capas-muro.webp',
  'blog/construccion-llave-en-mano-vs-administracion-tucuman/estres-comparativa.webp',
  'blog/mejores-empresas-refacciones-remodelaciones-tucuman/antes-despues.webp',
  'blog/construir-pileta-hormigon-vs-fibra-tucuman/estructura-pileta.webp',

  // Guías y Tipologías Hero & Heavy Images
  'levantan-los-pisos-ceramicos/img/hero.webp',
  'levantan-los-pisos-ceramicos/img/detalle.webp',
  'tipos-de-suelos/img/estudio_de_suelos.webp',
  'tipos-de-suelos/img/suelos_construccion.webp',
  'mejores-tipos-de-techos/img/techo_tejas.webp',
  'mejores-tipos-de-techos/img/techo_chapa.webp',
  'mejores-tipos-de-techos/img/techo_losa.webp',
  'mejores-tipos-de-techos/img/techo_madera.webp',
  'credito-hipotecario/images/hero_credit.webp',
  'casas-steel-framing/steel-framing-vs-construccion-tradicional/img/hero-tradicional.webp',
  'construccion-casas/hero.webp',
  'calculos-de-estructura/img/hero_estructuras.webp',
  'casas-steel-framing/ventajas-desventajas/img/hero-ventajas.webp',
  'casa-country/hero.webp',
  'casas-steel-framing/hero.webp',
  'duplex/hero.webp',
  'casa-con-pileta/hero.webp',
  'casa-ladrillo/hero.webp',
  'empieza-diseno-de-tu-casa/img/hero_diseno.webp',
  'entrepisos-de-madera/img/hero.webp',
  'construccion-en-seco/img/hero-seco.webp',
  'construccion-en-seco/img/seco-finished-hero.webp'
];

const backupDir = path.resolve('_original_assets_backup');

async function processImages() {
  console.log(`Starting image recompression on ${targetImages.length} images...`);
  let totalSaved = 0;

  for (const relPath of targetImages) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${relPath}`);
      continue;
    }

    const inputBuffer = fs.readFileSync(fullPath);
    const sizeBeforeKB = inputBuffer.length / 1024;

    // Backup original if not already backed up
    const backupPath = path.join(backupDir, relPath);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, inputBuffer);
    }

    const metadata = await sharp(inputBuffer).metadata();
    const isHero = relPath.includes('hero');

    // Target width: 960px for heroes, 900px for secondary (crisp 2x for mobile 400-480px)
    const targetWidth = isHero ? Math.min(metadata.width || 960, 960) : Math.min(metadata.width || 900, 900);
    // Aim for 60-120 KB target
    const targetQuality = isHero ? 75 : 72;

    const outputBuffer = await sharp(inputBuffer)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: targetQuality, effort: 6 })
      .toBuffer();

    const sizeAfterKB = outputBuffer.length / 1024;

    if (outputBuffer.length < inputBuffer.length) {
      fs.writeFileSync(fullPath, outputBuffer);
      const savedKB = sizeBeforeKB - sizeAfterKB;
      totalSaved += savedKB;
      console.log(`[OPTIMIZED] ${relPath}: ${sizeBeforeKB.toFixed(1)} KB -> ${sizeAfterKB.toFixed(1)} KB (-${savedKB.toFixed(1)} KB, ${((1 - outputBuffer.length/inputBuffer.length)*100).toFixed(0)}% saved)`);
    } else {
      console.log(`[SKIPPED] ${relPath}: already optimal (${sizeBeforeKB.toFixed(1)} KB)`);
    }
  }

  console.log(`\nRecompression complete! Total saved: ${(totalSaved / 1024).toFixed(2)} MB`);
}

processImages().catch(console.error);
