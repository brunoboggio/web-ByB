/**
 * download-and-optimize-google-images.js
 * 
 * Descarga imágenes de lh3.googleusercontent.com que se usan en index.html
 * y las guarda localmente con versiones responsivas (400w, 800w, 1200w).
 * 
 * Las imágenes descargadas se guardan en /img/ con nombres descriptivos.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'img');

// Crear directorio /img/ si no existe
if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

// Mapeo de URLs de Google → nombre local
// Cada imagen se descarga en resolución 1600px y luego se redimensiona
const GOOGLE_IMAGES = [
  {
    // Hero background (section#inicio) - ES EL LCP
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANcRehKX9SWaqrkO9y-2GakMt8vC3zfHRB-XlMgTgNH8bALgXaN1NzetPkSCdcad02K0-uZFWvz3OUNgp8uEZ7XOOLKx0U5IsKwpINdgKZQgqZEbgi7kJHWhVu2YsEdu6hisdLh7_TphwlxhXAKQcYF7s-EQWK2E9PsuF6xCstYNeLOlmXXxn4YWBPeYVH6FXP_yNo9zZj0GFcTwfR5jv8syBmkTFQkX4KymNNa57RgYd1jxn4ykbkgmx3WuuJpst0ml6hAzqysz-i',
    name: 'hero-bg',
    widths: [800, 1200, 1600],
    quality: 75,
  },
  {
    // "Nosotros" section - exterior modern house
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMBcZANJm3oeoVAGJIs-woKOe6eQrLsVE-YNFXkIIoVQiBuOkivEIz6S2x1llkHH1a6JpuNpnQP2muFMPXYZAXo2vpUALvnSsD46p-cf8YD1qu3Fav3rqbFsWRQzm1H5ZGHBas_rR__iHTFvOIYYp_Sa3FYU2Gmd5E87Lyju84JFH6f4gRzC1ZkW3Xkc8_2q9ODc3F6MA3APtXlOkmZ3qbr6wmUrjHJXHEdXMPOWwxb1k3ELSIfpvaaSNP79OQHk7GqfWNLg4I2h9W',
    name: 'nosotros',
    widths: [600, 900],
    quality: 80,
  },
  {
    // Card: Casa de Ladrillo
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFGuphCI4PbMjFxSFlSlYU9GQt0PZGRHYnhXzu5v0cVKQZuzVqN11XItwa4UvyHH7poH8nJu6CWPRhoE4egpVHuxPZ3F-9SHB7wchMUFWUY1FQUYgsP1Fd6RGXKrzV_HFS9ermH-_yQq7V65Y2HL7cntbVyoeg_XJOqfmH5UVCPYRIQ7Z0QcvyVEWgYzUdwK12hRW_UCdr2T77d11bQI7vALSQ_gZ_v5HDzJa5AYTpAnXRVeejQRopHM7u3NuRbEMBTqDxhwWGrT8z',
    name: 'casa-ladrillo-card',
    widths: [400, 800],
    quality: 80,
  },
  {
    // Card: Duplex Moderno
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM7xiLUd2H9dk9Zg1oZNgxJw6foo22IZl9mnlAbPlzPipG3xXI5FACkobU3ur4u12aDowFFrkrMB_537NpMkRK-VMR9eCKslIwqS6XtwIlrISwenGX334auf4LJG6Fz3IWExee9VYMpolkLArp7zxte3WO5f-hdI2lLEC4iqWY15tZrQozCG2GxT83VWErRQZXiyf1E3ZSXMZqFbSoRPM8MGe2endEvNdirR3J2BnXJGV_l_44R_bGaX6EQqgrUFrdun9h2GenOgw1',
    name: 'duplex-card',
    widths: [400, 800],
    quality: 80,
  },
  {
    // Card: Casa con Pileta
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMwylSj3oE6ZfaEXXzQoYjGs4sZ8iczTv2E52oj61aB8eDumedVMbgIAlSO-Ux2-pKYOTYSm8ZLlH0ZqOpNwn7eKrNzSWKEAkuWmimJsCS49SyDyQduLk7lI9GlOhK-SdSvDtIqDykdiKKlYw2O6lvbRW5OBpEXc1dW5oKHGD34nT09R9tu3qyXq3655pIrF7J85o0cb-Z4VQCaWaMmTEFivHLomqZNITpoWy3Xetc8OWdsk7Um9KDVpMRFHuLdAVRHA4kvKOpvo8',
    name: 'casa-pileta-card',
    widths: [400, 800],
    quality: 80,
  },
  {
    // Card: Cabaña Símil Tronco
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAttQBVMj_pvKZLeiiBoCgnlXDWY8tKHAbxTZoycHgn5DSaO9aoHQjKGwGYvXN2l01H0miDvOFaAWxuQwL_w9VhZjXftNGcn-zqvyaaZ8arFvtLqMIWzjWI-sD6cgdizHb7cJaPDEyvkFW-XZ1QyUiOP_75cPnr3V4ioNASWwqs05uYqn1kT9ZjHEuODOdvB1y5-RLpDDIY7v9p9bp7MJbSYp9SHwWtbVZ8TekVxUblJ4_exnV2Eg5BB5HxaToyIznpcEi9ugiaj1Sm',
    name: 'cabana-card',
    widths: [400, 800],
    quality: 80,
  },
  {
    // Card: Casa Moderna Minimalista
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf_-EYOgF75q5CMRwQM860qnc_qGQl12TSQKnbdMzimNJuMgzR7YNYrEln5_hnLvq-p4d0NSMAjJbh1iQhbhJnhMJ29tETTWwtPVjNs0wZpM6FvZiyKRQcfW6pdMD04y93vh3-M7-BGA1vDI9lKGhcIZ1dSTdFZGtKcUQk-fvyDQEzChFLvXoJ8wCC8D6A0a5Z26ytol1TjVPvvdlscr-_9DCxlRK2r4b0A4C7ew_dU-VsqVo383J6m1pjaPmNN-MugRUIIwif3sSm',
    name: 'casa-moderna-card',
    widths: [400, 800],
    quality: 80,
  },
  {
    // Card: Refacciones Inmobiliarias
    baseUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLqbCEOraLjyI112LEAfBLgwdyMiaZt0pbsq_SbdQ1mPXNa5hlIVTtpgQJNU6Hh4jggskXzOIJpIN-Uy3MCXYTvNDO0gpqUt5_YPXuWYNShDGgsOTaC3fzSwjJYj76V17jXUp9tRsl8-ZYOrKQSFfD6xHVsfT18pfsaJZpzIUtX_hho3PIO4-dGnhqP0c_0weuu-_EZLyrXGnqvy1GXFyWN_p3QH9bEW3ah2X2m78RXylpLJl31g3j8GJMF7X8mix1kgvaEC8gJ4wm',
    name: 'refacciones-card',
    widths: [400, 800],
    quality: 80,
  },
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadBuffer(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('⬇️  Descargando y optimizando imágenes de Google...\n');

  for (const img of GOOGLE_IMAGES) {
    const downloadUrl = `${img.baseUrl}=w1600-rw`;
    console.log(`📷 ${img.name} — descargando desde Google...`);

    let buffer;
    try {
      buffer = await downloadBuffer(downloadUrl);
    } catch (err) {
      console.error(`   ❌ Error descargando ${img.name}: ${err.message}`);
      continue;
    }

    const meta = await sharp(buffer).metadata();
    console.log(`   Tamaño original descargado: ${(buffer.length / 1024).toFixed(1)} KB (${meta.width}×${meta.height})`);

    for (const w of img.widths) {
      const outFile = path.join(IMG_DIR, `${img.name}-${w}w.webp`);
      await sharp(buffer)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: img.quality, effort: 6 })
        .toFile(outFile);
      const outSize = (fs.statSync(outFile).size / 1024).toFixed(1);
      console.log(`   ✅  img/${img.name}-${w}w.webp → ${outSize} KB`);
    }
    console.log('');
  }

  console.log('✅ Todas las imágenes de Google descargadas y optimizadas.');
  console.log(`📁 Guardadas en: ${IMG_DIR}`);
}

run().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
