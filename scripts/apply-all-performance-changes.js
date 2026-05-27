/**
 * apply-all-performance-changes.js
 * 
 * Aplica TODOS los cambios de performance en index.html de una vez:
 * 1. Favicon → Logo-48w.webp
 * 2. Material Symbols subsetado
 * 3. Eliminar preconnect a lh3.googleusercontent.com
 * 4. Preload del hero → imagen local con imagesrcset
 * 5. Hero section → <img> real con srcset (LCP crítico)
 * 6. Imagen nosotros → local con srcset
 * 7. Steel Framing card → srcset local
 * 8. Todas las cards → imágenes locales con srcset
 * 9. Scripts → versiones minificadas
 */

const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

const changes = [];

// ========== 1. FAVICON ==========
{
  const from = 'href="Logo%201.webp"';
  const to = 'href="Logo-48w.webp"';
  if (html.includes(from)) {
    html = html.replace(from, to);
    changes.push('✅ Favicon: Logo%201.webp → Logo-48w.webp');
  } else {
    changes.push('⚠️  Favicon: no encontrado');
  }
}

// ========== 2. PRECONNECT: eliminar lh3.googleusercontent.com ==========
{
  const from = '\n    <link rel="preconnect" href="https://lh3.googleusercontent.com"/>';
  if (html.includes(from)) {
    html = html.replace(from, '');
    changes.push('✅ Eliminado preconnect a lh3.googleusercontent.com');
  }
}

// ========== 3. MATERIAL SYMBOLS: subsetado ==========
{
  const symbolsRegex = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:wght,FILL@100\.\.700,0\.\.1&display=swap" rel="preload"[^>]+\/>\r?\n\s*<noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:wght,FILL@100\.\.700,0\.\.1&display=swap" rel="stylesheet"\/><\/noscript>/;
  const to = '<!-- Material Symbols SUBSETADO: solo íconos usados (~15KB vs ~1MB completo) -->\n    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0&icon_names=architecture,arrow_downward,arrow_forward,bar_chart,call,cancel,chat,check,check_circle,chevron_right,close,construction,dark_mode,email,expand_more,explore,group,handshake,home,keyboard_arrow_right,light_mode,location_on,menu,phone,search,shield,star,support_agent,tune,verified,visibility&display=swap" rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"/>\n    <noscript><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0&icon_names=architecture,arrow_downward,arrow_forward,bar_chart,call,cancel,chat,check,check_circle,chevron_right,close,construction,dark_mode,email,expand_more,explore,group,handshake,home,keyboard_arrow_right,light_mode,location_on,menu,phone,search,shield,star,support_agent,tune,verified,visibility&display=swap" rel="stylesheet"/></noscript>';
  if (symbolsRegex.test(html)) {
    html = html.replace(symbolsRegex, to);
    changes.push('✅ Material Symbols subsetado a ~15KB');
  } else {
    changes.push('⚠️  Material Symbols: pattern no encontrado (ya subsetado?)');
  }
}

// ========== 4. PRELOAD HERO: de Google → local con imagesrcset ==========
{
  const heroGooglePreloadRegex = /\s*<!-- Preload Hero Image -->\s*\n\s*<link rel="preload" as="image" href="https:\/\/lh3\.googleusercontent\.com\/[^"]+"\s+fetchpriority="high"\/>/;
  const newPreload = `\n    <!-- Preload Hero Image (local, optimizada: 14KB vs 312KB de Google) -->
    <link rel="preload" as="image" href="/img/hero-bg-1200w.webp" imagesrcset="/img/hero-bg-800w.webp 800w, /img/hero-bg-1200w.webp 1200w, /img/hero-bg-1600w.webp 1600w" imagesizes="100vw" fetchpriority="high"/>`;
  if (heroGooglePreloadRegex.test(html)) {
    html = html.replace(heroGooglePreloadRegex, newPreload);
    changes.push('✅ Preload hero: Google → local con imagesrcset');
  }
}

// ========== 5. SCRIPTS: versiones minificadas ==========
{
  html = html.replace(
    '<script src="./components/header.js?v=1.2" defer></script>',
    '<script src="./components/header.min.js?v=1.3" defer></script>'
  );
  html = html.replace(
    '<script src="./components/footer.js?v=1.2" defer></script>',
    '<script src="./components/footer.min.js?v=1.3" defer></script>'
  );
  changes.push('✅ Scripts: usando versiones minificadas (header.min.js, footer.min.js)');
}

// ========== 6. HERO SECTION: background-image CSS → <img> real ==========
{
  const heroSection = /(<section id="inicio"[^>]*?)style="background-image: url\('https:\/\/lh3\.googleusercontent\.com\/[^']+'\); background-size: cover; background-position: center;"(>)/;
  if (heroSection.test(html)) {
    html = html.replace(heroSection, (match, before, after) => {
      return `${before}${after}
        <!-- Hero Image como <img> real: permite al navegador detectar LCP y hacer preload correcto -->
        <img
            src="/img/hero-bg-1200w.webp"
            srcset="/img/hero-bg-800w.webp 800w, /img/hero-bg-1200w.webp 1200w, /img/hero-bg-1600w.webp 1600w"
            sizes="100vw"
            fetchpriority="high"
            decoding="async"
            width="1200"
            height="819"
            alt="Casa moderna construida por Constructora ByB en Tucumán"
            class="absolute inset-0 w-full h-full object-cover"
        />`;
    });
    changes.push('✅ Hero: background-image CSS → <img> real con srcset');
  }
}

// ========== 7. IMAGEN "NOSOTROS" ==========
{
  const nosotrosRegex = /<img loading="lazy" alt="Exterior de casa moderna construida por ByB" class="rounded-xl w-full h-\[550px\] object-cover shadow-2xl relative z-10 hover:scale-\[1\.01\] transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCMBc[^"]+"\s*\/>/;
  const nosotrosNew = `<img
                        loading="lazy"
                        decoding="async"
                        alt="Exterior de casa moderna construida por ByB en Tucumán"
                        class="rounded-xl w-full h-[550px] object-cover shadow-2xl relative z-10 hover:scale-[1.01] transition-transform duration-500"
                        src="/img/nosotros-600w.webp"
                        srcset="/img/nosotros-600w.webp 600w, /img/nosotros-900w.webp 900w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        width="900"
                        height="550"
                    />`;
  if (nosotrosRegex.test(html)) {
    html = html.replace(nosotrosRegex, nosotrosNew);
    changes.push('✅ Nosotros: 360KB Google → 29KB local con srcset');
  }
}

// ========== 8. STEEL FRAMING CARD ==========
{
  const sfRegex = /<img fetchpriority="high" fetchpriority="high" alt="Casas Steel Framing en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\.\/casas-steel-framing\/hero\.webp"\/>/;
  const sfNew = `<img
                            loading="lazy"
                            decoding="async"
                            alt="Casas Steel Framing en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="./casas-steel-framing/hero-800w.webp"
                            srcset="./casas-steel-framing/hero-400w.webp 400w, ./casas-steel-framing/hero-800w.webp 800w, ./casas-steel-framing/hero-1200w.webp 1200w"
                            sizes="(max-width: 768px) 100vw, 42vw"
                            width="800"
                            height="640"
                        />`;
  if (sfRegex.test(html)) {
    html = html.replace(sfRegex, sfNew);
    changes.push('✅ Steel Framing card: srcset local');
  }
}

// ========== 9. CASA LADRILLO CARD ==========
{
  const regex = /<img loading="lazy" alt="Construcción de Casa de Ladrillo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCFGu[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Construcción de Casa de Ladrillo en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/casa-ladrillo-card-400w.webp" srcset="/img/casa-ladrillo-card-400w.webp 400w, /img/casa-ladrillo-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Casa Ladrillo card'); }
}

// ========== 10. DUPLEX CARD ==========
{
  const regex = /<img loading="lazy" alt="Arquitectura de Duplex Moderno" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDM7x[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Arquitectura de Dúplex Moderno en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/duplex-card-400w.webp" srcset="/img/duplex-card-400w.webp 400w, /img/duplex-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Dúplex card'); }
}

// ========== 11. CASA CON PILETA CARD ==========
{
  const regex = /<img loading="lazy" alt="Diseño de Casa con Pileta" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuArMw[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Diseño de Casa con Pileta en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/casa-pileta-card-400w.webp" srcset="/img/casa-pileta-card-400w.webp 400w, /img/casa-pileta-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Casa con Pileta card'); }
}

// ========== 12. CABAÑA CARD ==========
{
  const regex = /<img loading="lazy" alt="Construcción de Cabaña Simil Tronco" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuAttQ[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Construcción de Cabaña Símil Tronco en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/cabana-card-400w.webp" srcset="/img/cabana-card-400w.webp 400w, /img/cabana-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Cabaña card'); }
}

// ========== 13. CASA MODERNA CARD ==========
{
  const regex = /<img loading="lazy" alt="Arquitectura de Casa Moderna Minimalista" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDf_-[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Arquitectura de Casa Moderna Minimalista en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/casa-moderna-card-400w.webp" srcset="/img/casa-moderna-card-400w.webp 400w, /img/casa-moderna-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Casa Moderna card'); }
}

// ========== 14. CASA COUNTRY CARD ==========
{
  const regex = /<img fetchpriority="high" fetchpriority="high" alt="Diseño y Construcción de Casas de Country" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\.\/casa-country\/hero\.webp"\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Diseño y Construcción de Casas de Country en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="./casa-country/hero-400w.webp" srcset="./casa-country/hero-400w.webp 400w, ./casa-country/hero-800w.webp 800w, ./casa-country/hero-1200w.webp 1200w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Casa Country card'); }
}

// ========== 15. REFACCIONES CARD ==========
{
  const regex = /<img loading="lazy" alt="Servicio de Refacciones Inmobiliarias" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBLqb[^"]+"\s*\/>/;
  const newImg = `<img loading="lazy" decoding="async" alt="Servicio de Refacciones Inmobiliarias en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="/img/refacciones-card-400w.webp" srcset="/img/refacciones-card-400w.webp 400w, /img/refacciones-card-800w.webp 800w" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" width="400" height="224"/>`;
  if (regex.test(html)) { html = html.replace(regex, newImg); changes.push('✅ Refacciones card'); }
}

// ========== GUARDAR ==========
fs.writeFileSync(INDEX, html, 'utf8');

// ========== RESUMEN ==========
console.log('\n=== CAMBIOS APLICADOS ===');
changes.forEach(c => console.log(c));

const remaining = (html.match(/lh3\.googleusercontent\.com/g) || []).length;
const srcsets = (html.match(/srcset=/g) || []).length;
const heroAsImg = html.includes('/img/hero-bg-1200w.webp') && !html.includes('background-image: url');
const minScripts = html.includes('header.min.js');
const iconNames = html.includes('icon_names=');

console.log('\n=== VERIFICACIÓN FINAL ===');
console.log('URLs Google restantes:', remaining, '(esperado: 4 en meta/schema)');
console.log('Imágenes con srcset:', srcsets);
console.log('Hero como <img> real:', heroAsImg ? 'SI ✅' : 'NO ❌');
console.log('Scripts minificados:', minScripts ? 'SI ✅' : 'NO ❌');
console.log('Material Symbols subsetado:', iconNames ? 'SI ✅' : 'NO ❌');
console.log('Tamaño HTML:', (fs.statSync(INDEX).size / 1024).toFixed(1), 'KB');
