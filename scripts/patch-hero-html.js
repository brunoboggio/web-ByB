const fs = require('fs');
const path = require('path');

const blogDirs = [
  'blog/ampliacion-planta-alta-steel-framing-tucuman/index.html',
  'blog/construccion-llave-en-mano-vs-administracion-tucuman/index.html',
  'blog/construir-pileta-hormigon-vs-fibra-tucuman/index.html',
  'blog/mejores-constructoras-casas-country-tucuman/index.html',
  'blog/mejores-constructoras-yerba-buena/index.html',
  'blog/mejores-empresas-construccion-tucuman/index.html',
  'blog/mejores-empresas-refacciones-remodelaciones-tucuman/index.html',
  'blog/mejores-empresas-steel-framing-tucuman/index.html'
];

// 1. Update 8 Blog Articles
for (const file of blogDirs) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');

  // Fix preload
  html = html.replace(
    /<link\s+rel=["']preload["']\s+as=["']image["']\s+href=["']\.\.\/\.\.\/Logo\.webp["']\s+fetchpriority=["']high["']\s*\/?>/i,
    '<link rel="preload" as="image" href="hero.webp" fetchpriority="high"/>'
  );

  // Fix hero img tag
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']hero\.webp["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" alt="$1" class="$2" src="hero.webp" />'
  );

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Updated blog article: ${file}`);
}

// 2. Update precio-construccion-m2/index.html
if (fs.existsSync('precio-construccion-m2/index.html')) {
  let html = fs.readFileSync('precio-construccion-m2/index.html', 'utf8');
  html = html.replace(
    /<link\s+rel=["']preload["']\s+as=["']image["']\s+href=["']\.\.\/Logo\.webp["']\s+fetchpriority=["']high["']\s*\/?>/i,
    '<link rel="preload" as="image" href="/img/hero-bg-1200w.webp" fetchpriority="high"/>'
  );
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']\/img\/hero-bg-1200w\.webp["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="1200" height="580" alt="$1" class="$2" src="/img/hero-bg-1200w.webp" />'
  );
  fs.writeFileSync('precio-construccion-m2/index.html', html, 'utf8');
  console.log('Updated precio-construccion-m2/index.html');
}

// 3. Update construccion-en-seco/index.html
if (fs.existsSync('construccion-en-seco/index.html')) {
  let html = fs.readFileSync('construccion-en-seco/index.html', 'utf8');
  html = html.replace(
    /<link\s+rel=["']preload["']\s+as=["']image["']\s+href=["']\.\.\/Logo\.webp["']\s+fetchpriority=["']high["']\s*\/?>/i,
    '<link rel="preload" as="image" href="img/seco-finished-hero.webp" fetchpriority="high"/>'
  );
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+src=["']img\/seco-finished-hero\.webp["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" src="img/seco-finished-hero.webp" alt="$1" class="$2" />'
  );
  fs.writeFileSync('construccion-en-seco/index.html', html, 'utf8');
  console.log('Updated construccion-en-seco/index.html');
}

// 4. Update casas-steel-framing/index.html
if (fs.existsSync('casas-steel-framing/index.html')) {
  let html = fs.readFileSync('casas-steel-framing/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']hero\.webp["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" alt="$1" class="$2" src="hero.webp" />'
  );
  fs.writeFileSync('casas-steel-framing/index.html', html, 'utf8');
  console.log('Updated casas-steel-framing/index.html');
}

// 5. Update casa-country/index.html
if (fs.existsSync('casa-country/index.html')) {
  let html = fs.readFileSync('casa-country/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']hero\.webp["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" alt="$1" class="$2" src="hero.webp" />'
  );
  fs.writeFileSync('casa-country/index.html', html, 'utf8');
  console.log('Updated casa-country/index.html');
}

// 6. Update duplex/index.html
if (fs.existsSync('duplex/index.html')) {
  let html = fs.readFileSync('duplex/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']hero\.webp["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" alt="$1" class="$2" src="hero.webp" />'
  );
  fs.writeFileSync('duplex/index.html', html, 'utf8');
  console.log('Updated duplex/index.html');
}

// 7. Update casa-moderna/index.html
if (fs.existsSync('casa-moderna/index.html')) {
  let html = fs.readFileSync('casa-moderna/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+data-alt=["']([^"']*)["']\s+src=["']([^"']*)["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="1200" height="800" alt="$1" class="$2" data-alt="$3" src="$4" />'
  );
  fs.writeFileSync('casa-moderna/index.html', html, 'utf8');
  console.log('Updated casa-moderna/index.html');
}

// 8. Update mejores-tipos-de-techos/index.html
if (fs.existsSync('mejores-tipos-de-techos/index.html')) {
  let html = fs.readFileSync('mejores-tipos-de-techos/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']([^"']*)["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="1200" height="600" alt="$1" class="$2" src="$3" />'
  );
  fs.writeFileSync('mejores-tipos-de-techos/index.html', html, 'utf8');
  console.log('Updated mejores-tipos-de-techos/index.html');
}

// 9. Update entrepisos-de-madera/index.html
if (fs.existsSync('entrepisos-de-madera/index.html')) {
  let html = fs.readFileSync('entrepisos-de-madera/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+src=["']img\/hero\.webp["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="960" height="540" src="img/hero.webp" alt="$1" class="$2" />'
  );
  fs.writeFileSync('entrepisos-de-madera/index.html', html, 'utf8');
  console.log('Updated entrepisos-de-madera/index.html');
}

// 10. Update contacto/index.html
if (fs.existsSync('contacto/index.html')) {
  let html = fs.readFileSync('contacto/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+src=["']([^"']*)["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" width="1200" height="600" alt="$1" class="$2" src="$3" />'
  );
  fs.writeFileSync('contacto/index.html', html, 'utf8');
  console.log('Updated contacto/index.html');
}

// 11. Update levantan-los-pisos-ceramicos/index.html
if (fs.existsSync('levantan-los-pisos-ceramicos/index.html')) {
  let html = fs.readFileSync('levantan-los-pisos-ceramicos/index.html', 'utf8');
  html = html.replace(
    /<img\s+fetchpriority=["']high["']\s+src=["']img\/hero\.webp["']\s+alt=["']([^"']*)["']\s+class=["']([^"']*)["']\s+width=["']1200["']\s+height=["']650["']\s*\/?>/i,
    '<img fetchpriority="high" loading="eager" src="img/hero.webp" alt="$1" class="$2" width="1200" height="650" />'
  );
  fs.writeFileSync('levantan-los-pisos-ceramicos/index.html', html, 'utf8');
  console.log('Updated levantan-los-pisos-ceramicos/index.html');
}
