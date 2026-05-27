/**
 * patch-index-images.js
 * Reemplaza las URLs de imágenes de Google en index.html por versiones locales
 * con srcset y width/height correctos.
 */

const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(INDEX, 'utf8');

// ============================================================
// 1. Imagen "Nosotros" (360KB Google → 29KB local)
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Exterior de casa moderna construida por ByB" class="rounded-xl w-full h-\[550px\] object-cover shadow-2xl relative z-10 hover:scale-\[1\.01\] transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCMBc[^"]+"\/>/, 
  `<img
                        loading="lazy"
                        decoding="async"
                        alt="Exterior de casa moderna construida por ByB en Tucumán"
                        class="rounded-xl w-full h-[550px] object-cover shadow-2xl relative z-10 hover:scale-[1.01] transition-transform duration-500"
                        src="/img/nosotros-600w.webp"
                        srcset="/img/nosotros-600w.webp 600w, /img/nosotros-900w.webp 900w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        width="900"
                        height="550"
                    />`
);

// ============================================================
// 2. Steel Framing card hero (solo quitamos fetchpriority duplicado y agregamos srcset)
// ============================================================
html = html.replace(
  /<img fetchpriority="high" fetchpriority="high" alt="Casas Steel Framing en Tucumán" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\.\/casas-steel-framing\/hero\.webp"\/>/,
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Casas Steel Framing en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="./casas-steel-framing/hero-800w.webp"
                            srcset="./casas-steel-framing/hero-400w.webp 400w, ./casas-steel-framing/hero-800w.webp 800w, ./casas-steel-framing/hero-1200w.webp 1200w"
                            sizes="(max-width: 768px) 100vw, 42vw"
                            width="800"
                            height="640"
                        />`
);

// ============================================================
// 3. Casa Ladrillo card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Construcción de Casa de Ladrillo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCFGu[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Construcción de Casa de Ladrillo en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/casa-ladrillo-card-400w.webp"
                            srcset="/img/casa-ladrillo-card-400w.webp 400w, /img/casa-ladrillo-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 4. Duplex card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Arquitectura de Duplex Moderno" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDM7x[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Arquitectura de Dúplex Moderno en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/duplex-card-400w.webp"
                            srcset="/img/duplex-card-400w.webp 400w, /img/duplex-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 5. Casa con Pileta card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Diseño de Casa con Pileta" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuArMw[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Diseño de Casa con Pileta en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/casa-pileta-card-400w.webp"
                            srcset="/img/casa-pileta-card-400w.webp 400w, /img/casa-pileta-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 6. Cabaña card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Construcción de Cabaña Simil Tronco" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuAttQ[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Construcción de Cabaña Símil Tronco en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/cabana-card-400w.webp"
                            srcset="/img/cabana-card-400w.webp 400w, /img/cabana-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 7. Casa Moderna card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Arquitectura de Casa Moderna Minimalista" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuDf_-[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Arquitectura de Casa Moderna Minimalista en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/casa-moderna-card-400w.webp"
                            srcset="/img/casa-moderna-card-400w.webp 400w, /img/casa-moderna-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 8. Casa Country card (quitar fetchpriority duplicado, agregar srcset)
// ============================================================
html = html.replace(
  /<img fetchpriority="high" fetchpriority="high" alt="Diseño y Construcción de Casas de Country" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\.\/casa-country\/hero\.webp"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Diseño y Construcción de Casas de Country en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="./casa-country/hero-400w.webp"
                            srcset="./casa-country/hero-400w.webp 400w, ./casa-country/hero-800w.webp 800w, ./casa-country/hero-1200w.webp 1200w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

// ============================================================
// 9. Refacciones card
// ============================================================
html = html.replace(
  /<img loading="lazy" alt="Servicio de Refacciones Inmobiliarias" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBLqb[^"]+"\/>/, 
  `<img
                            loading="lazy"
                            decoding="async"
                            alt="Servicio de Refacciones Inmobiliarias en Tucumán"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="/img/refacciones-card-400w.webp"
                            srcset="/img/refacciones-card-400w.webp 400w, /img/refacciones-card-800w.webp 800w"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            width="400"
                            height="224"
                        />`
);

fs.writeFileSync(INDEX, html, 'utf8');

// Verify replacements
const remaining = (html.match(/lh3\.googleusercontent\.com/g) || []).length;
console.log(`✅ Imágenes actualizadas en index.html`);
console.log(`📊 URLs de Google restantes en index.html: ${remaining} (solo deben quedar en meta tags OG/Twitter y Schema.org JSON-LD)`);

// Count local img tags with srcset
const srcsetCount = (html.match(/srcset="/g) || []).length;
console.log(`📸 Imágenes con srcset: ${srcsetCount}`);
