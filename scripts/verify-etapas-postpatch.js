process.env.NODE_PATH = "C:\\Users\\Bruno\\AppData\\Local\\npm-cache\\_npx\\0f94ee7615faf582\\node_modules";
require('module').Module._initPaths();

const http = require('http');
const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const PORT = 8092;
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
            resolve(server);
        });
    });
}

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

async function run() {
    const server = await startServer();
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });

    const targetUrl = `http://127.0.0.1:${PORT}/casas-steel-framing/etapas-construccion/`;
    console.log(`Auditing patched ${targetUrl}...`);

    // Desktop
    const resDesk = await lighthouse(targetUrl, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance'],
        ...desktopConfig
    });
    const aDesk = resDesk.lhr.audits;
    const sDesk = Math.round((resDesk.lhr.categories.performance.score || 0) * 100);

    // Mobile
    const resMob = await lighthouse(targetUrl, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        throttlingMethod: 'simulate'
    });
    const aMob = resMob.lhr.audits;
    const sMob = Math.round((resMob.lhr.categories.performance.score || 0) * 100);

    console.log(`POST-PATCH RESULTS for Etapas Construcción:`);
    console.log(` DESKTOP: Score=${sDesk} | LCP=${aDesk['largest-contentful-paint']?.displayValue} | CLS=${aDesk['cumulative-layout-shift']?.displayValue} | TBT=${aDesk['total-blocking-time']?.displayValue}`);
    console.log(` MOBILE : Score=${sMob} | LCP=${aMob['largest-contentful-paint']?.displayValue} | CLS=${aMob['cumulative-layout-shift']?.displayValue} | TBT=${aMob['total-blocking-time']?.displayValue}`);

    await chrome.kill();
    server.close();

    // Update pending_urls_cwv_results.json
    const cwvResults = JSON.parse(fs.readFileSync('scripts/pending_urls_cwv_results.json', 'utf8'));
    const item = cwvResults.find(r => r.path === '/casas-steel-framing/etapas-construccion/');
    if (item) {
        item.local.desktop = {
            score: sDesk,
            lcp: aDesk['largest-contentful-paint']?.displayValue,
            cls: aDesk['cumulative-layout-shift']?.displayValue,
            tbt: aDesk['total-blocking-time']?.displayValue
        };
        item.local.mobile = {
            score: sMob,
            lcp: aMob['largest-contentful-paint']?.displayValue,
            cls: aMob['cumulative-layout-shift']?.displayValue,
            tbt: aMob['total-blocking-time']?.displayValue
        };
        fs.writeFileSync('scripts/pending_urls_cwv_results.json', JSON.stringify(cwvResults, null, 2));
    }
}

run().catch(console.error);
