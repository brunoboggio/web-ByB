const fs = require('fs');
const path = require('path');

const pendingUrls = [
  'aviso-legal/index.html',
  'politica-privacidad/index.html',
  'empieza-diseno-de-tu-casa/index.html',
  'refacciones-inmobiliarias/aumentar-valor-vivienda/index.html',
  'construccion-casas/index.html',
  'credito-hipotecario/index.html',
  'calculos-de-estructura/index.html',
  'casa-con-pileta/index.html',
  'casa-ladrillo/index.html',
  'tipos-de-suelos/index.html',
  'casas-steel-framing/etapas-construccion/index.html',
  'casas-steel-framing/steel-framing-vs-construccion-tradicional/index.html',
  'casas-steel-framing/ventajas-desventajas/index.html',
  'blog/ampliacion-planta-alta-steel-framing-tucuman/index.html',
  'blog/construccion-llave-en-mano-vs-administracion-tucuman/index.html',
  'blog/construir-pileta-hormigon-vs-fibra-tucuman/index.html',
  'blog/mejores-constructoras-casas-country-tucuman/index.html',
  'blog/mejores-empresas-construccion-tucuman/index.html',
  'blog/mejores-empresas-refacciones-remodelaciones-tucuman/index.html',
  'blog/mejores-empresas-steel-framing-tucuman/index.html'
];

const results = [];

pendingUrls.forEach(file => {
    if (!fs.existsSync(file)) {
        results.push({ file, error: 'File not found' });
        return;
    }
    const content = fs.readFileSync(file, 'utf8');
    const dir = path.dirname(file);

    // Hero preloads
    const preloads = [...content.matchAll(/<link[^>]+rel=["']preload["'][^>]+href=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);

    // Images
    const imgMatches = [...content.matchAll(/<img([^>]+)>/gi)];
    const images = imgMatches.map(m => {
        const tag = m[1];
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : '';
        const widthMatch = tag.match(/width=["']([^"']+)["']/i);
        const heightMatch = tag.match(/height=["']([^"']+)["']/i);
        const loadingMatch = tag.match(/loading=["']([^"']+)["']/i);
        const fetchpriorityMatch = tag.match(/fetchpriority=["']([^"']+)["']/i);

        // Check local file size if relative
        let sizeKb = null;
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            const resolvedPath = path.resolve(dir, src);
            if (fs.existsSync(resolvedPath)) {
                sizeKb = Math.round(fs.statSync(resolvedPath).size / 1024);
            }
        }

        return {
            src,
            width: widthMatch ? widthMatch[1] : null,
            height: heightMatch ? heightMatch[1] : null,
            loading: loadingMatch ? loadingMatch[1] : null,
            fetchpriority: fetchpriorityMatch ? fetchpriorityMatch[1] : null,
            sizeKb
        };
    });

    results.push({
        file,
        preloads,
        imagesCount: images.length,
        images
    });
});

console.log(JSON.stringify(results, null, 2));
fs.writeFileSync('scripts/pending_urls_images.json', JSON.stringify(results, null, 2));
