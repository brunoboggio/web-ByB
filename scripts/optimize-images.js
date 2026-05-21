const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const SRC_DIR = path.resolve(__dirname, '..');
const BACKUP_DIR = path.resolve(SRC_DIR, '_original_assets_backup');
const QUALITY = 80;

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.github',
  '_original_assets_backup',
  'scripts',
  'css',
  '.antigravity'
];

// Helper to check if file is an image we want to optimize
function isOptimizableImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
}

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Recursive function to walk directory and find images
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.includes(entry.name)) {
        continue;
      }
      await processDirectory(fullPath);
    } else if (entry.isFile() && isOptimizableImage(fullPath)) {
      await optimizeImage(fullPath);
    }
  }
}

// Optimize a single image
async function optimizeImage(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirName = path.dirname(filePath);
  
  const webpPath = path.join(dirName, `${baseName}.webp`);

  console.log(`Optimizing: ${relativePath}...`);

  try {
    // 1. Convert to WebP using sharp
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    console.log(`  -> Created WebP: ${path.relative(SRC_DIR, webpPath)}`);

    // 2. Move original to backup directory, recreating directory structure
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const backupParentDir = path.dirname(backupPath);

    if (!fs.existsSync(backupParentDir)) {
      fs.mkdirSync(backupParentDir, { recursive: true });
    }

    fs.renameSync(filePath, backupPath);
    console.log(`  -> Moved original to: _original_assets_backup/${relativePath}`);
  } catch (error) {
    console.error(`  [ERROR] Failed to process ${relativePath}:`, error.message);
  }
}

// Start execution
(async () => {
  console.log('Starting image optimization to WebP...');
  console.log(`Source directory: ${SRC_DIR}`);
  console.log(`Backup directory: ${BACKUP_DIR}`);
  console.log(`Target quality: ${QUALITY}%\n`);

  const startTime = Date.now();
  await processDirectory(SRC_DIR);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\nImage optimization finished in ${duration}s.`);
})();
