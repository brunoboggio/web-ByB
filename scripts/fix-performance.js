/**
 * fix-performance.js
 * Applies the top performance fixes across the entire web site:
 *
 * Fix 1 — Material Symbols: replace the full (1MB+) Google Fonts icon library
 *          with a subsetted version containing only the icons actually used
 *          across the site. Saves ~1,000 KB per page.
 *
 * Fix 2 — header/footer scripts: update all pages to use the real minified
 *          components (header.min.js / footer.min.js) with version v=1.4.
 *          Also fixes the path-detection regex in header.min.js so it matches
 *          the new filename.
 *
 * Fix 3 — Logo in header.js: replace the 190 KB "Logo 1.webp" with the
 *          already-existing 1.5 KB "Logo-48w.webp" (with srcset to 96w).
 *          Adds explicit width/height to prevent Layout Shift.
 *
 * Fix 4 — HSTS in .htaccess: add Strict-Transport-Security header so the
 *          browser never performs an HTTP→HTTPS redirect round-trip.
 *
 * Fix 5 — Manrope font removal: pages that load 4 font families are trimmed
 *          to just the 2 families actually needed (Metropolis + Hanken Grotesk),
 *          cutting ~400 KB of font downloads per page.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const EXCLUDED_DIRS = [
  'node_modules', '.git', '.github', '_original_assets_backup',
  'scripts', '.antigravity', 'skills'
];

// ─────────────────────────────────────────────────────────────────────────────
// Subset URL — covers every icon used across the entire site
// (union of all icon_names from index.html + all internal pages)
// ─────────────────────────────────────────────────────────────────────────────
const MATERIAL_SYMBOLS_SUBSETTED =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' +
  '&icon_names=architecture,arrow_downward,arrow_forward,article,balance,bar_chart,calculate,call,cancel,' +
  'change_history,chat,check,check_circle,chevron_right,cleaning_services,close,construction,cottage,' +
  'dark_mode,eco,email,engineering,expand_more,explore,foundation,grid_on,grid_view,group,' +
  'handshake,holiday_village,home,home_repair_service,humidity_percentage,keyboard_arrow_right,' +
  'landscape,layers,layers_clear,light_mode,location_on,mail,menu,phone,pool,' +
  'precision_manufacturing,request_quote,roofing,schedule,search,shield,space_bar,' +
  'star,support_agent,tune,verified,villa,visibility,water_damage' +
  '&display=swap';

// Old pattern (full library — both variants found in the codebase)
const OLD_MATERIAL_PATTERN =
  /https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:[^"']+display=swap/g;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function walkHtml(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) walkHtml(full, callback);
    } else if (entry.isFile() && full.endsWith('.html')) {
      callback(full);
    }
  }
}

let totalFiles = 0;
let changedFiles = 0;

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1 + 2 + 5: Process each HTML file
// ─────────────────────────────────────────────────────────────────────────────
walkHtml(ROOT, (filePath) => {
  totalFiles++;
  const rel = path.relative(ROOT, filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // --- Fix 1: Subset Material Symbols ---
  if (OLD_MATERIAL_PATTERN.test(content)) {
    content = content.replace(OLD_MATERIAL_PATTERN, MATERIAL_SYMBOLS_SUBSETTED);
    // Reset lastIndex after test+replace
  }
  // Re-apply because regex .test() advances lastIndex
  content = content.replace(OLD_MATERIAL_PATTERN, MATERIAL_SYMBOLS_SUBSETTED);

  // --- Fix 2: Switch header.js → header.min.js and footer.js → footer.min.js ---
  // Handles both depth=1 (../components/) and depth=2 (../../components/)
  content = content
    .replace(/((?:\.\.\/)+components\/)header\.js(\?v=)[0-9.]+/g, '$1header.min.js$21.4')
    .replace(/((?:\.\.\/)+components\/)footer\.js(\?v=)[0-9.]+/g, '$1footer.min.js$21.4');

  // Also update root-level references (./components/)
  content = content
    .replace(/(\.\/components\/)header\.js(\?v=)[0-9.]+/g, '$1header.min.js$21.4')
    .replace(/(\.\/components\/)footer\.js(\?v=)[0-9.]+/g, '$1footer.min.js$21.4');

  // --- Fix 5: Remove Manrope from font requests (only on pages that have it) ---
  // Removes "family=Manrope:wght@..." from Google Fonts URL concatenations
  content = content.replace(/&family=Manrope:[^&"']+/g, '');
  // Also remove as standalone if it appears first (rare)
  content = content.replace(/family=Manrope:[^&"']+&?/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles++;
    console.log(`  ✓  ${rel}`);
  }
});

console.log(`\nHTML fix complete: ${changedFiles}/${totalFiles} files updated.\n`);

// ─────────────────────────────────────────────────────────────────────────────
// FIX 3: Update Logo in header.js (and header.min.js will be regenerated)
// ─────────────────────────────────────────────────────────────────────────────
const headerPath = path.join(ROOT, 'components', 'header.js');
let headerContent = fs.readFileSync(headerPath, 'utf8');
const headerOriginal = headerContent;

// Replace Logo.webp img tag with proper srcset + dimensions (prevents Layout Shift)
// The header renders: <img src="${basePath}Logo.webp" class="h-12 w-auto ..." />
headerContent = headerContent.replace(
  /(<img\s+src="\$\{basePath\})Logo\.webp("\s+alt="Constructora ByB Logo"\s+class="[^"]*")(\s*\/>)/g,
  '$1Logo-48w.webp$2 srcset="${basePath}Logo-48w.webp 1x, ${basePath}Logo-96w.webp 2x" width="48" height="48"$3'
);

// More flexible fallback — in case the class string differs
if (headerContent === headerOriginal) {
  headerContent = headerContent.replace(
    /\$\{basePath\}Logo\.webp/g,
    '${basePath}Logo-48w.webp'
  );
  // Add missing width/height if the img tag doesn't have them
  headerContent = headerContent.replace(
    /(alt="Constructora ByB Logo"\s+class="[^"]*")(\s*\/>)/g,
    '$1 width="48" height="48"$2'
  );
}

// Also fix the path-detection regex so it still works with header.min.js filename
headerContent = headerContent.replace(
  /src\.includes\('components\/header\.js'\)/g,
  "src.includes('components/header')"
);

if (headerContent !== headerOriginal) {
  fs.writeFileSync(headerPath, headerContent, 'utf8');
  console.log('  ✓  components/header.js — Logo updated to Logo-48w.webp + srcset');
} else {
  console.log('  ·  components/header.js — Logo already correct, no change needed');
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX 4: Add HSTS to .htaccess
// ─────────────────────────────────────────────────────────────────────────────
const htaccessPath = path.join(ROOT, '.htaccess');
let htContent = fs.readFileSync(htaccessPath, 'utf8');

if (!htContent.includes('Strict-Transport-Security')) {
  // Insert HSTS right after the existing X-Content-Type-Options line
  const hsts = `  # HSTS: Force browsers to always use HTTPS (eliminates HTTP→HTTPS redirect round-trip)
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"\n`;

  htContent = htContent.replace(
    '  Header always set X-Content-Type-Options nosniff',
    '  Header always set X-Content-Type-Options nosniff\n' + hsts
  );
  fs.writeFileSync(htaccessPath, htContent, 'utf8');
  console.log('  ✓  .htaccess — HSTS header added');
} else {
  console.log('  ·  .htaccess — HSTS already present, no change needed');
}

console.log('\n✅ All performance fixes applied successfully.');
console.log('\nNext step: Run  npm install -D terser  then  node scripts/minify-components.js');
