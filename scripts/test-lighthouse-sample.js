process.env.NODE_PATH = "C:\\Users\\Bruno\\AppData\\Local\\npm-cache\\_npx\\0f94ee7615faf582\\node_modules";
require('module').Module._initPaths();

const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');

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

async function test() {
    const chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
    });

    const testUrls = [
        'https://constructorabyb.com.ar/casa-ladrillo/',
        'https://constructorabyb.com.ar/construccion-casas/'
    ];

    for (const targetUrl of testUrls) {
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

        console.log(`URL: ${targetUrl}`);
        console.log(` DESKTOP: Score=${sDesk} | LCP=${aDesk['largest-contentful-paint']?.displayValue} | CLS=${aDesk['cumulative-layout-shift']?.displayValue} | TBT=${aDesk['total-blocking-time']?.displayValue} | TTFB=${aDesk['server-response-time']?.displayValue}`);
        console.log(` MOBILE : Score=${sMob} | LCP=${aMob['largest-contentful-paint']?.displayValue} | CLS=${aMob['cumulative-layout-shift']?.displayValue} | TBT=${aMob['total-blocking-time']?.displayValue} | TTFB=${aMob['server-response-time']?.displayValue}`);
    }

    await chrome.kill();
}

test().catch(console.error);
