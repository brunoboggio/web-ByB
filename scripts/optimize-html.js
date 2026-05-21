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

// Global schema definition for Constructora ByB Organization
const globalOrgSchema = {
  "@type": "ConstructionCompany",
  "@id": "https://constructorabyb.com.ar/#organization",
  "name": "Constructora ByB",
  "legalName": "Constructora ByB SRL",
  "url": "https://constructorabyb.com.ar/",
  "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCMBcZANJm3oeoVAGJIs-woKOe6eQrLsVE-YNFXkIIoVQiBuOkivEIz6S2x1llkHH1a6JpuNpnQP2muFMPXYZAXo2vpUALvnSsD46p-cf8YD1qu3Fav3rqbFsWRQzm1H5ZGHBas_rR__iHTFvOIYYp_Sa3FYU2Gmd5E87Lyju84JFH6f4gRzC1ZkW3Xkc8_2q9ODc3F6MA3APtXlOkmZ3qbr6wmUrjHJXHEdXMPOWwxb1k3ELSIfpvaaSNP79OQHk7GqfWNLg4I2h9W",
  "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuANcRehKX9SWaqrkO9y-2GakMt8vC3zfHRB-XlMgTgNH8bALgXaN1NzetPkSCdcad02K0-uZFWvz3OUNgp8uEZ7XOOLKx0U5IsKwpINdgKZQgqZEbgi7kJHWhVu2YsEdu6hisdLh7_TphwlxhXAKQcYF7s-EQWK2E9PsuF6xCstYNeLOlmXXxn4YWBPeYVH6FXP_yNo9zZj0GFcTwfR5jv8syBmkTFQkX4KymNNa57RgYd1jxn4ykbkgmx3WuuJpst0ml6hAzqysz-i",
  "description": "Empresa constructora líder en Tucumán con más de 10 años de experiencia. Especialistas en diseño, arquitectura y construcción llave en mano de casas modernas, steel framing, dúplex y refacciones residenciales.",
  "sameAs": [
    "https://www.wikidata.org/wiki/Q2516812",
    "https://maps.google.com/?q=Crisostomo+Alvarez+1584+San+Miguel+de+Tucuman",
    "https://www.facebook.com/constructorabyb",
    "https://www.instagram.com/constructorabyb"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Crisóstomo Alvarez 1584",
    "addressLocality": "San Miguel de Tucumán",
    "addressRegion": "Tucumán",
    "postalCode": "T4000",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -26.830400,
    "longitude": -65.203800
  },
  "areaServed": [
    {
      "@type": "State",
      "@id": "https://www.wikidata.org/wiki/Q44829",
      "name": "Tucumán",
      "sameAs": "https://www.wikidata.org/wiki/Q44829"
    },
    {
      "@type": "City",
      "@id": "https://www.wikidata.org/wiki/Q45758",
      "name": "San Miguel de Tucumán",
      "sameAs": "https://www.wikidata.org/wiki/Q45758"
    },
    {
      "@type": "City",
      "@id": "https://www.wikidata.org/wiki/Q2287957",
      "name": "Yerba Buena",
      "sameAs": "https://www.wikidata.org/wiki/Q2287957"
    }
  ],
  "telephone": "+5403816425740",
  "email": "construccionesbybsrl@gmail.com",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$$"
};

// Helper to replace the inner content of a tag with a specific ID, balancing the tag
function replaceTagContent(content, tagId, replacementContent) {
  const regex = new RegExp(`<([a-zA-Z0-9]+)\\s+[^>]*id=["']${tagId}["'][^>]*>`, 'i');
  const match = content.match(regex);
  if (!match) return content;

  const startTag = match[0];
  const tagName = match[1];
  const startIndex = match.index;
  const contentStartIndex = startIndex + startTag.length;

  let nestingLevel = 1;
  const tagSearchRegex = new RegExp(`<${tagName}\\b|<\\/${tagName}\\b`, 'gi');
  tagSearchRegex.lastIndex = contentStartIndex;

  let tagMatch;
  while ((tagMatch = tagSearchRegex.exec(content)) !== null) {
    if (tagMatch[0].toLowerCase() === `<${tagName}`) {
      nestingLevel++;
    } else {
      nestingLevel--;
    }

    if (nestingLevel === 0) {
      const endIndex = tagMatch.index;
      const before = content.substring(0, contentStartIndex);
      const after = content.substring(endIndex);
      return before + replacementContent + after;
    }
  }

  return content;
}

// Helper to inject static <noscript> navigation and contact fallbacks
function injectNoscriptFallbacks(content, prefix) {
  const headerFallback = `
        <noscript>
            <nav class="flex flex-wrap justify-between items-center px-4 md:px-8 h-20 max-w-7xl mx-auto bg-surface-container-lowest border-b border-outline-variant/60">
                <div class="flex items-center gap-3">
                    <a href="${prefix || './'}" class="flex items-center gap-2">
                        <img src="${prefix}Logo%201.webp" alt="Constructora ByB Logo" class="h-12 w-auto object-contain" />
                    </a>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm font-semibold">
                    <a href="${prefix || './'}" class="text-on-surface-variant hover:text-primary">Inicio</a>
                    <a href="${prefix}casas-steel-framing/" class="text-on-surface-variant hover:text-primary">Steel Framing</a>
                    <a href="${prefix}casa-moderna/" class="text-on-surface-variant hover:text-primary">Casas Modernas</a>
                    <a href="${prefix}duplex/" class="text-on-surface-variant hover:text-primary">Dúplex</a>
                    <a href="${prefix}casa-con-pileta/" class="text-on-surface-variant hover:text-primary">Casas con Pileta</a>
                    <a href="${prefix}casa-ladrillo/" class="text-on-surface-variant hover:text-primary">Casas de Ladrillo</a>
                    <a href="${prefix}refacciones-inmobiliarias/" class="text-on-surface-variant hover:text-primary">Refacciones</a>
                    <a href="${prefix}credito-hipotecario/" class="text-on-surface-variant hover:text-primary">Crédito Hipotecario</a>
                    <a href="${prefix}mejores-tipos-de-techos/" class="text-on-surface-variant hover:text-primary">Techos</a>
                    <a href="${prefix}tipos-de-suelos/" class="text-on-surface-variant hover:text-primary">Suelos</a>
                    <a href="${prefix}calculos-de-estructura/" class="text-on-surface-variant hover:text-primary">Estructura</a>
                    <a href="${prefix}empieza-diseno-de-tu-casa/" class="text-on-surface-variant hover:text-primary">Diseño</a>
                    <a href="${prefix}contacto/" class="text-on-surface-variant hover:text-primary">Contacto</a>
                </div>
            </nav>
        </noscript>`;

  const footerFallback = `
        <noscript>
            <footer class="bg-tertiary text-on-tertiary p-8 text-sm">
                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p class="font-bold text-base mb-2">Constructora ByB SRL</p>
                        <p>Crisóstomo Alvarez 1584, San Miguel de Tucumán, Tucumán, Argentina</p>
                        <p>Teléfono: <a href="tel:03816425740" class="underline">0381 642-5740</a></p>
                        <p>Email: <a href="mailto:construccionesbybsrl@gmail.com" class="underline">construccionesbybsrl@gmail.com</a></p>
                        <p>Horarios: Lunes a Viernes de 9:00 a 18:00 hs</p>
                    </div>
                    <div>
                        <p class="font-bold text-base mb-2">Enlaces Rápidos</p>
                        <ul class="space-y-1">
                            <li><a href="${prefix || './'}" class="underline">Inicio</a></li>
                            <li><a href="${prefix}#nosotros" class="underline">Quiénes Somos</a></li>
                            <li><a href="${prefix}#servicios" class="underline">Modelos y Servicios</a></li>
                            <li><a href="${prefix}credito-hipotecario/" class="underline">Crédito Hipotecario</a></li>
                            <li><a href="${prefix}contacto/" class="underline">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <p class="font-bold text-base mb-2">Páginas Legales</p>
                        <ul class="space-y-1">
                            <li><a href="${prefix}politica-privacidad/" class="underline">Políticas de Privacidad</a></li>
                            <li><a href="${prefix}politica-privacidad/#cookies" class="underline">Políticas de Cookies</a></li>
                            <li><a href="${prefix}aviso-legal/" class="underline">Aviso Legal</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </noscript>`;

  let updated = content;

  if (content.match(/<header\s+[^>]*id=["']main-header["']/i)) {
    console.log(`  -> Injected header <noscript> fallback`);
    updated = replaceTagContent(updated, 'main-header', headerFallback);
  }

  if (content.match(/<(div|footer)\s+[^>]*id=["']main-footer["']/i)) {
    console.log(`  -> Injected footer <noscript> fallback`);
    updated = replaceTagContent(updated, 'main-footer', footerFallback);
  }

  return updated;
}

// Helper to inject/consolidate the global organization schema into JSON-LD @graph arrays
function injectGlobalEntitySchema(content) {
  const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  
  return content.replace(jsonLdRegex, (match, rawJson) => {
    try {
      const parsed = JSON.parse(rawJson.trim());
      if (parsed && Array.isArray(parsed["@graph"])) {
        const graph = parsed["@graph"];
        const hasOrg = graph.some(item => item["@id"] === "https://constructorabyb.com.ar/#organization");
        if (!hasOrg) {
          graph.push(globalOrgSchema);
          const formattedJson = JSON.stringify(parsed, null, 2);
          const indentedJson = formattedJson.split('\n').map(line => '    ' + line).join('\n');
          console.log(`  -> Injected global organization schema into JSON-LD @graph`);
          return `<script type="application/ld+json">\n${indentedJson}\n    </script>`;
        }
      }
    } catch (e) {
      console.warn(`  -> Failed to parse/update JSON-LD script block: ${e.message}`);
    }
    return match;
  });
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

  // 6. Inject static <noscript> fallbacks for SEO/AEO crawlers
  content = injectNoscriptFallbacks(content, prefix);

  // 7. Consolidate and resolve global entity of Constructora ByB
  content = injectGlobalEntitySchema(content);

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
