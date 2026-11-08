process.env.NODE_PATH = "C:\\Users\\Bruno\\AppData\\Local\\npm-cache\\_npx\\0f94ee7615faf582\\node_modules";
require('module').Module._initPaths();

const http = require('http');
const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const PORT = 8089;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let reqUrl = req.url.split('?')[0];
            if (reqUrl === '/') reqUrl = '/index.html';
            let filePath = path.join(ROOT_DIR, decodeURIComponent(reqUrl));
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
            if (!fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(filePath).pipe(res);
        });
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`Local dev server listening on http://127.0.0.1:${PORT}`);
            resolve(server);
        });
    });
}

const PENDING_URLS = [
  { path: '/aviso-legal/', name: 'Aviso Legal', category: 'Institucional & Legal' },
  { path: '/politica-privacidad/', name: 'Política de Privacidad', category: 'Institucional & Legal' },
  { path: '/empieza-diseno-de-tu-casa/', name: 'Empieza Diseño de tu Casa', category: 'Institucional & Legal' },
  { path: '/refacciones-inmobiliarias/aumentar-valor-vivienda/', name: 'Aumentar Valor Vivienda', category: 'Institucional & Legal' },
  { path: '/construccion-casas/', name: 'Construcción de Casas', category: 'Servicios Pilares' },
  { path: '/credito-hipotecario/', name: 'Crédito Hipotecario', category: 'Servicios Pilares' },
  { path: '/calculos-de-estructura/', name: 'Cálculos de Estructura', category: 'Servicios Pilares' },
  { path: '/casa-con-pileta/', name: 'Casa con Pileta', category: 'Tipologías y Modelos' },
  { path: '/casa-ladrillo/', name: 'Casa de Ladrillo Visto', category: 'Tipologías y Modelos' },
  { path: '/tipos-de-suelos/', name: 'Guía Tipos de Suelos', category: 'Guías Técnicas / Patologías' },
  { path: '/casas-steel-framing/etapas-construccion/', name: 'Etapas Construcción Steel Framing', category: 'Guías Técnicas / Patologías' },
  { path: '/casas-steel-framing/steel-framing-vs-construccion-tradicional/', name: 'Steel Framing vs Tradicional', category: 'Guías Técnicas / Patologías' },
  { path: '/casas-steel-framing/ventajas-desventajas/', name: 'Ventajas y Desventajas Steel Framing', category: 'Guías Técnicas / Patologías' },
  { path: '/blog/ampliacion-planta-alta-steel-framing-tucuman/', name: 'Blog: Ampliación Planta Alta', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/construccion-llave-en-mano-vs-administracion-tucuman/', name: 'Blog: Llave en Mano vs Administración', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/construir-pileta-hormigon-vs-fibra-tucuman/', name: 'Blog: Pileta Hormigón vs Fibra', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/mejores-constructoras-casas-country-tucuman/', name: 'Blog: Mejores Constructoras Country', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/mejores-empresas-construccion-tucuman/', name: 'Blog: Mejores Empresas Construcción', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/mejores-empresas-refacciones-remodelaciones-tucuman/', name: 'Blog: Mejores Refacciones Remodelaciones', category: 'Blog & Contenido GEO/SEO' },
  { path: '/blog/mejores-empresas-steel-framing-tucuman/', name: 'Blog: Mejores Empresas Steel Framing', category: 'Blog & Contenido GEO/SEO' }
];

const desktopConfig = {
  formFactor: 'desktop',
  screenEmulation: {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
  },
  throttling: {
    rttMs: 40,
    throughputKbps: 10240,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0
  },
  throttlingMethod: 'simulate'
};

const mobileConfig = {
  formFactor: 'mobile',
  throttlingMethod: 'simulate'
};

async function audit(chromePort, url, isDesktop) {
    const flags = {
        port: chromePort,
        output: 'json',
        onlyCategories: ['performance'],
        ...(isDesktop ? desktopConfig : mobileConfig)
    };
    const res = await lighthouse(url, flags);
    const audits = res.lhr.audits;
    return {
        score: Math.round((res.lhr.categories.performance.score || 0) * 100),
        lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
        lcpVal: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
        fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        cls: audits['cumulative-layout-shift']?.displayValue || '0',
        clsVal: Number((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
        tbt: audits['total-blocking-time']?.displayValue || '0 ms',
        tbtVal: Math.round(audits['total-blocking-time']?.numericValue || 0),
        ttfb: audits['server-response-time']?.displayValue || 'N/A'
    };
}

async function run() {
    const server = await startServer();
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });

    console.log(`Starting audit of ${PENDING_URLS.length} pending URLs...`);
    const results = [];

    for (let i = 0; i < PENDING_URLS.length; i++) {
        const item = PENDING_URLS[i];
        const localUrl = `http://127.0.0.1:${PORT}${item.path}`;
        const prodUrl = `https://constructorabyb.com.ar${item.path}`;

        console.log(`\n[${i + 1}/${PENDING_URLS.length}] Auditing ${item.name} (${item.path})...`);
        
        // 1. Audit local (Optimized version)
        const localDesktop = await audit(chrome.port, localUrl, true);
        const localMobile = await audit(chrome.port, localUrl, false);

        // 2. Audit prod (Live Baseline version)
        const prodDesktop = await audit(chrome.port, prodUrl, true);
        const prodMobile = await audit(chrome.port, prodUrl, false);

        console.log(`   OPTIMIZED (Local) -> Desktop: ${localDesktop.score} (CLS: ${localDesktop.cls}, LCP: ${localDesktop.lcp}) | Mobile: ${localMobile.score} (CLS: ${localMobile.cls}, LCP: ${localMobile.lcp})`);
        console.log(`   BASELINE  (Prod)  -> Desktop: ${prodDesktop.score} (CLS: ${prodDesktop.cls}, LCP: ${prodDesktop.lcp}) | Mobile: ${prodMobile.score} (CLS: ${prodMobile.cls}, LCP: ${prodMobile.lcp})`);

        results.push({
            path: item.path,
            name: item.name,
            category: item.category,
            local: {
                desktop: localDesktop,
                mobile: localMobile
            },
            prod: {
                desktop: prodDesktop,
                mobile: prodMobile
            }
        });
    }

    await chrome.kill();
    server.close();

    fs.writeFileSync('scripts/pending_urls_cwv_results.json', JSON.stringify(results, null, 2));
    console.log('\nAudit complete! Results saved to scripts/pending_urls_cwv_results.json');
}

run().catch(err => {
    console.error('Fatal audit error:', err);
    process.exit(1);
});
