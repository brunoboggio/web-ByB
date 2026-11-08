process.env.NODE_PATH = "C:\\Users\\Bruno\\AppData\\Local\\npm-cache\\_npx\\0f94ee7615faf582\\node_modules";
require('module').Module._initPaths();

const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function test() {
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });
    console.log('Chrome launched on port', chrome.port);

    const targetUrl = 'https://constructorabyb.com.ar/aviso-legal/';
    const flags = {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        throttlingMethod: 'simulate'
    };

    const res = await lighthouse(targetUrl, flags);
    const audits = res.lhr.audits;
    const score = Math.round((res.lhr.categories.performance.score || 0) * 100);
    console.log(`Audited: ${targetUrl}`);
    console.log(`Score: ${score}`);
    console.log(`LCP: ${audits['largest-contentful-paint']?.displayValue}`);
    console.log(`FCP: ${audits['first-contentful-paint']?.displayValue}`);
    console.log(`CLS: ${audits['cumulative-layout-shift']?.displayValue}`);
    console.log(`TBT: ${audits['total-blocking-time']?.displayValue}`);
    console.log(`TTFB: ${audits['server-response-time']?.displayValue}`);

    await chrome.kill();
}

test().catch(console.error);
