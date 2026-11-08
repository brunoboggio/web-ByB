process.env.NODE_PATH = "C:\\Users\\Bruno\\AppData\\Local\\npm-cache\\_npx\\0f94ee7615faf582\\node_modules";
require('module').Module._initPaths();

const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

const URLS = [
  { url: 'http://127.0.0.1:8080/precio-construccion-m2/', name: 'Cotizador M2' },
  { url: 'http://127.0.0.1:8080/construccion-en-seco/', name: 'Construcción en Seco' },
  { url: 'http://127.0.0.1:8080/casas-steel-framing/', name: 'Steel Framing Pilar' },
  { url: 'http://127.0.0.1:8080/levantan-los-pisos-ceramicos/', name: 'Guía Pisos Cerámicos' },
  { url: 'http://127.0.0.1:8080/mejores-tipos-de-techos/', name: 'Guía Tipos de Techos' },
  { url: 'http://127.0.0.1:8080/casa-country/', name: 'Tipología Casa Country' },
  { url: 'http://127.0.0.1:8080/blog/mejores-constructoras-yerba-buena/', name: 'Blog Yerba Buena' },
  { url: 'http://127.0.0.1:8080/casas-steel-framing/capas-muro-tabique-3d/', name: 'Muro Tabique 3D' }
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

async function auditUrl(chromePort, target, isDesktop = false) {
  const flags = {
    port: chromePort,
    output: 'json',
    onlyCategories: ['performance'],
    ...(isDesktop ? desktopConfig : mobileConfig)
  };

  const res = await lighthouse(target.url, flags);
  const lhr = res.lhr;
  const audits = lhr.audits;
  const perfScore = Math.round((lhr.categories.performance.score || 0) * 100);

  const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
  const lcpVal = Math.round(audits['largest-contentful-paint']?.numericValue || 0);
  const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
  const fcpVal = Math.round(audits['first-contentful-paint']?.numericValue || 0);
  const cls = audits['cumulative-layout-shift']?.displayValue || '0';
  const clsVal = Number((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3));
  const tbt = audits['total-blocking-time']?.displayValue || '0 ms';
  const tbtVal = Math.round(audits['total-blocking-time']?.numericValue || 0);

  return {
    url: target.url,
    name: target.name,
    strategy: isDesktop ? 'Desktop' : 'Mobile',
    score: perfScore,
    lcp,
    lcpVal,
    fcp,
    fcpVal,
    cls,
    clsVal,
    tbt,
    tbtVal
  };
}

async function run() {
  console.log(`Starting Local Core Web Vitals verification for ${URLS.length} critical URLs...`);
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const results = [];

  try {
    for (let i = 0; i < URLS.length; i++) {
      const target = URLS[i];
      console.log(`\n[${i + 1}/${URLS.length}] Testing ${target.name} (${target.url})...`);
      
      const dsk = await auditUrl(chrome.port, target, true);
      console.log(`   DESKTOP: Score=${dsk.score} | CLS=${dsk.cls} (val:${dsk.clsVal}) | LCP=${dsk.lcp} | TBT=${dsk.tbt}`);
      
      const mob = await auditUrl(chrome.port, target, false);
      console.log(`   MOBILE : Score=${mob.score} | CLS=${mob.cls} (val:${mob.clsVal}) | LCP=${mob.lcp} | TBT=${mob.tbt}`);

      results.push({ desktop: dsk, mobile: mob });
    }

    fs.writeFileSync('scripts/local_cwv_results.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('\nAudit complete! Results saved to scripts/local_cwv_results.json');
  } finally {
    await chrome.kill();
  }
}

run().catch(console.error);
