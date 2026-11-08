const fs = require('fs');
const path = require('path');
const url = require('url');

const scan = JSON.parse(fs.readFileSync('scripts/scan_summary.json', 'utf8'));
const validCanonicalUrls = new Set(Object.values(scan.canonicalMap));

const brokenOrExternal = [];
const internalReferencedUrls = new Set();

scan.htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fileCanonical = scan.canonicalMap[file];
    const base = new url.URL(fileCanonical);

    const regex = /<a[^>]+href=["']([^"']+)["']/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const href = match[1].trim();
        if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
        
        let resolved;
        try {
            resolved = new url.URL(href, base);
        } catch(e) {
            brokenOrExternal.push({ file, href, error: e.message });
            continue;
        }

        if (resolved.hostname === 'constructorabyb.com.ar') {
            const cleanUrl = resolved.origin + (resolved.pathname.endsWith('/') ? resolved.pathname : resolved.pathname + '/');
            internalReferencedUrls.add(cleanUrl);
            if (!validCanonicalUrls.has(cleanUrl)) {
                brokenOrExternal.push({ file, href, resolved: cleanUrl, issue: 'Target URL does not match any known canonical' });
            }
        }
    }
});

console.log('Total unique internal canonicals referenced in HTML links:', internalReferencedUrls.size);
console.log('Broken or unresolved internal links:', brokenOrExternal.length);
if (brokenOrExternal.length > 0) {
    console.log(JSON.stringify(brokenOrExternal.slice(0, 10), null, 2));
}

// Check sitemap.xml vs canonicals
console.log('\n--- SITEMAP.XML VS CANONICALS ---');
const sitemapSet = new Set(scan.sitemapUrls);
const missingInSitemap = [];
validCanonicalUrls.forEach(u => {
    if (!sitemapSet.has(u)) {
        missingInSitemap.push(u);
    }
});
console.log('URLs in Canonical but missing in sitemap.xml:', missingInSitemap.length);
missingInSitemap.forEach(u => console.log(' - ' + u));

const inSitemapButNotCanonical = [];
sitemapSet.forEach(u => {
    if (!validCanonicalUrls.has(u)) {
        inSitemapButNotCanonical.push(u);
    }
});
console.log('URLs in sitemap.xml but not among Canonical HTML files:', inSitemapButNotCanonical.length);
inSitemapButNotCanonical.forEach(u => console.log(' - ' + u));
