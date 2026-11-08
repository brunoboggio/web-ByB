const fs = require('fs');
const https = require('https');
const sharp = require('sharp');

const url = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU8xgumT6Ftn3aNUU2a5GiYS3u8-B_yKM-T7uxxLjRHXjxl8BLPbgok1OyJiOvQz_AfiyFwIgbm9T_IABUhDnBR41WzU3NiDulzUpzLG3M8dVzwhAkJa9AjL4iFknTPTnI43p3qV1Wz8u5CjKMZMCSo1EFcf-1rOOlaiEr7aMRKyYdYJ8KPZFOtW5giuQHI8DE9OGllLT1bLdPSmNWtcgpdA9o6nR50mfB-0CMesZf6oXXU-zOo3vH-QA_k4sbJgE-wNDDt__472M=w1200-rw';
const targetDir = 'mejores-tipos-de-techos/img';
const targetFile = 'mejores-tipos-de-techos/img/hero.webp';

https.get(url, (res) => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    const optimized = await sharp(buffer)
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toBuffer();
    fs.writeFileSync(targetFile, optimized);
    console.log(`Saved local hero to ${targetFile}: ${(optimized.length / 1024).toFixed(1)} KB`);
  });
}).on('error', console.error);
