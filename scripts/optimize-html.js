const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.github',
  '_original_assets_backup',
  'scripts',
  '.antigravity'
];

// Helper to check if file is HTML
function isHtmlFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.html';
}

// Helper to replace local image extensions with .webp
function replaceLocalImages(content) {
  // 1. Matches local images in src, href, poster, srcset attributes
  let updated = content.replace(/((?:src|href|poster|srcset)=["'])([^"'\s]+\.(?:png|jpg|jpeg))(["'])/gi, (match, prefix, url, suffix) => {
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
      return match;
    }
    const newUrl = url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    return `${prefix}${newUrl}${suffix}`;
  });

  // 2. Matches local images in CSS url(...)
  updated = updated.replace(/url\((['"]?)([^'")\s]+\.(?:png|jpg|jpeg))\1\)/gi, (match, quote, url) => {
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
      return match;
    }
    const newUrl = url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    return `url(${quote}${newUrl}${quote})`;
  });

  return updated;
}

// Function to process a single HTML file
function optimizeHtmlFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  console.log(`Optimizing HTML: ${relativePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace Tailwind CDN & Config Script
  // Computes the correct relative path to css/tailwind.min.css based on directory depth
  const depth = relativePath.split(path.sep).length - 1;
  const prefix = '../'.repeat(depth);
  const cssPath = `${prefix}css/tailwind.min.css`;
  const cssLinkTag = `<link rel="stylesheet" href="${cssPath}">`;

  // Matches the Tailwind CDN script and the tailwind-config script block
  const tailwindCdnRegex = /<script\s+src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>\s*<script\s+id="tailwind-config"[^>]*>[\s\S]*?<\/script>/gi;
  if (tailwindCdnRegex.test(content)) {
    content = content.replace(tailwindCdnRegex, cssLinkTag);
    console.log(`  -> Replaced Tailwind CDN with static link: ${cssLinkTag}`);
  } else {
    // Fallback if they are separated or structured differently
    const singleCdnRegex = /<script\s+src="https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>/gi;
    const configRegex = /<script\s+id="tailwind-config"[^>]*>[\s\S]*?<\/script>/gi;
    if (singleCdnRegex.test(content)) {
      content = content.replace(singleCdnRegex, cssLinkTag);
      content = content.replace(configRegex, '');
      console.log(`  -> Replaced separated Tailwind CDN/Config with static link`);
    }
  }

  // 2. Replace local image extensions with .webp
  content = replaceLocalImages(content);

  // Correct favicon type from image/jpeg to image/webp for .webp links
  content = content.replace(/(<link\s+[^>]*type=["'])image\/jpeg(["'][^>]*href=["'][^"']+\.webp["'])/gi, '$1image/webp$2');
  content = content.replace(/(<link\s+[^>]*href=["'][^"']+\.webp["'][^>]*type=["'])image\/jpeg(["'])/gi, '$1image/webp$2');


  // Reset previously optimized (possibly nested/broken) font links to clean up any nested noscript tags
  const cleanFontsRegex = /<link\s+href="(https:\/\/fonts\.googleapis\.com\/css2?[^"]+)"\s+rel="preload"\s+as="style"\s+onload="[^"]*"\s*\/?>\s*<noscript>(?:<link\s+[^>]*\s*\/?>\s*|<noscript>)*<link\s+href="\1"\s+rel="stylesheet"\s*\/?>(?:\s*<\/noscript>)+/gi;
  content = content.replace(cleanFontsRegex, '<link href="$1" rel="stylesheet"/>');

  // 3. Optimize Google Fonts and Material Symbols stylesheet tags (making them non-blocking)
  const fontsRegex = /<link\s+href="(https:\/\/fonts\.googleapis\.com\/css2?[^"]+)"\s+rel="stylesheet"\s*\/?>/gi;
  content = content.replace(fontsRegex, (match, url, offset) => {
    // Check if this match is wrapped inside <noscript>
    const before = content.substring(0, offset);
    const lastOpenNoscript = before.lastIndexOf('<noscript>');
    const lastCloseNoscript = before.lastIndexOf('</noscript>');
    if (lastOpenNoscript > lastCloseNoscript) {
      return match;
    }
    console.log(`  -> Optimized font stylesheet loading for: ${url.substring(0, 50)}...`);
    return `<link href="${url}" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'"/>\n    <noscript><link href="${url}" rel="stylesheet"/></noscript>`;
  });

  // 4. Preconnect to Google User Content domain (lh3.googleusercontent.com)
  if (content.includes('lh3.googleusercontent.com') && !content.includes('href="https://lh3.googleusercontent.com"')) {
    const preconnectGstaticRegex = /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s*(?:crossorigin)?\s*\/?>/gi;
    const replacement = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>\n    <link rel="preconnect" href="https://lh3.googleusercontent.com"/>`;
    if (preconnectGstaticRegex.test(content)) {
      content = content.replace(preconnectGstaticRegex, replacement);
      console.log(`  -> Added preconnect for lh3.googleusercontent.com`);
    }
  }

  // 5. Hero Preload and Lazy Loading
  // Find background hero image url in the first 5000 characters of the body
  let heroPreloadUrl = null;
  const bodyStartIndex = content.indexOf('<body');
  if (bodyStartIndex !== -1) {
    const bodySnippet = content.substring(bodyStartIndex, bodyStartIndex + 6000);
    // Find background-image url
    const bgImageMatch = bodySnippet.match(/style="[^"]*background-image:\s*url\((['"]?)([^'")]+)\1\)[^"]*"/i);
    if (bgImageMatch) {
      heroPreloadUrl = bgImageMatch[2];
      console.log(`  -> Found hero background image for preloading: ${heroPreloadUrl.substring(0, 60)}...`);
    }
  }

  // Parse and process <img> tags
  let imgCounter = 0;
  content = content.replace(/<img\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi, (match, attrs, src) => {
    imgCounter++;
    
    // If we didn't find a background hero image, use the first <img> tag as the hero
    if (imgCounter === 1 && !heroPreloadUrl) {
      heroPreloadUrl = src;
      console.log(`  -> Found hero img tag for preloading: ${heroPreloadUrl}`);
    }

    // Add loading="lazy" to all images except the first one (above the fold)
    if (imgCounter > 1 && !attrs.includes('loading=')) {
      // Append loading="lazy" inside the img attributes
      return `<img loading="lazy" ${attrs}>`;
    }
    
    return match;
  });

  // Inject preloads right before </head>
  if (heroPreloadUrl) {
    const preloadTag = `\n    <!-- Preload Hero Image -->\n    <link rel="preload" as="image" href="${heroPreloadUrl}" fetchpriority="high"/>`;
    if (!content.includes(heroPreloadUrl) || !content.includes('rel="preload" as="image"')) {
      content = content.replace('</head>', `${preloadTag}\n</head>`);
      console.log(`  -> Injected hero image preload tag in head`);
    }
  }

  // Ensure all image preloads have fetchpriority="high" for optimal LCP
  content = content.replace(/<link\s+([^>]*rel=["']preload["'][^>]*as=["']image["'][^>]*)\/?>/gi, (match, attrs) => {
    if (!attrs.includes('fetchpriority=')) {
      const cleanAttrs = attrs.trim().replace(/\/$/, '').trim();
      return `<link ${cleanAttrs} fetchpriority="high"/>`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

// Function to process dynamic components
function optimizeComponentFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath);
  console.log(`Optimizing Component: ${relativePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  content = replaceLocalImages(content);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  -> Updated all local image extensions to WebP`);
}

// Recursive function to walk directory and find HTML files
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.includes(entry.name)) {
        continue;
      }
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      if (isHtmlFile(fullPath)) {
        optimizeHtmlFile(fullPath);
      }
    }
  }
}

// Start execution
(() => {
  console.log('Starting HTML and Component optimization...');
  console.log(`Source directory: ${SRC_DIR}\n`);

  // Process all HTML pages
  processDirectory(SRC_DIR);

  // Process header and footer components
  const headerPath = path.join(SRC_DIR, 'components', 'header.js');
  const footerPath = path.join(SRC_DIR, 'components', 'footer.js');

  if (fs.existsSync(headerPath)) {
    optimizeComponentFile(headerPath);
  }
  if (fs.existsSync(footerPath)) {
    optimizeComponentFile(footerPath);
  }

  console.log('\nHTML and Component optimization finished successfully.');
})();
