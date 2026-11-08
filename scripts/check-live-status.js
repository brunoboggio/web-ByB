const https = require('https');
const fs = require('fs');

const scan = JSON.parse(fs.readFileSync('scripts/scan_summary.json', 'utf8'));
const urls = Object.values(scan.canonicalMap);

async function checkUrl(u) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = https.get(u, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CWV-Auditor/1.0'
            },
            timeout: 10000
        }, (res) => {
            const ttfb = Date.now() - start;
            resolve({
                url: u,
                statusCode: res.statusCode,
                ttfb,
                location: res.headers['location'] || null
            });
        });
        req.on('error', (err) => {
            resolve({
                url: u,
                statusCode: 'ERROR: ' + err.message,
                ttfb: Date.now() - start,
                location: null
            });
        });
        req.on('timeout', () => {
            req.destroy();
            resolve({
                url: u,
                statusCode: 'TIMEOUT',
                ttfb: 10000,
                location: null
            });
        });
    });
}

async function run() {
    console.log(`Checking live status for all ${urls.length} canonical URLs on https://constructorabyb.com.ar/ ...`);
    const results = [];
    for (const u of urls) {
        const res = await checkUrl(u);
        console.log(`${res.statusCode} | TTFB: ${res.ttfb}ms | ${res.url} ${res.location ? '-> ' + res.location : ''}`);
        results.push(res);
    }
    fs.writeFileSync('scripts/live_status_check.json', JSON.stringify(results, null, 2));
}

run();
