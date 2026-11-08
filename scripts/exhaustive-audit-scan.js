const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!['node_modules', '.git', 'scratch', 'dist', '_original_assets_backup', '.antigravity'].includes(file)) {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const rootDir = process.cwd();
const htmlFiles = getHtmlFiles(rootDir);
console.log('Total HTML files found on disk:', htmlFiles.length);

const relPaths = htmlFiles.map(f => path.relative(rootDir, f).replace(/\\/g, '/'));
relPaths.sort();
console.log('\n--- HTML FILES ON DISK (' + relPaths.length + ') ---');
relPaths.forEach((p, idx) => console.log(`${idx + 1}. ${p}`));

const hrefSet = new Set();
const canonicalMap = {};
const fileDetails = [];

htmlFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const relFile = path.relative(rootDir, f).replace(/\\/g, '/');
    
    // Canonical
    const canMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                     content.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    const canonical = canMatch ? canMatch[1] : null;
    if (canonical) {
        canonicalMap[relFile] = canonical;
    }

    // Check tailwind async css bug: media="print" onload=...
    const hasTailwindPrintBug = /tailwind\.min\.css["'][^>]*media=["']print["']/i.test(content) ||
                                /media=["']print["'][^>]*tailwind\.min\.css/i.test(content);

    // Check images
    const imgMatches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    const images = imgMatches.map(m => m[1]);

    fileDetails.push({
        file: relFile,
        canonical,
        hasTailwindPrintBug,
        imageCount: images.length
    });
    
    // hrefs
    const regex = /<a[^>]+href=["']([^"']+)["']/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
        hrefSet.add(match[1]);
    }
});

// Also check components/header.js and footer.js
['components/header.js', 'components/footer.js'].forEach(comp => {
    if (fs.existsSync(comp)) {
        const content = fs.readFileSync(comp, 'utf8');
        const regex = /href=["'`](\$\{basePath\}[^"'`]+|[^"'`]+)["'`]/gi;
        let match;
        while ((match = regex.exec(content)) !== null) {
            hrefSet.add(match[1]);
        }
    }
});

console.log('\n--- CANONICALS FOUND (' + Object.keys(canonicalMap).length + ') ---');
Object.entries(canonicalMap).forEach(([k, v]) => console.log(`${k} => ${v}`));

console.log('\n--- TAILWIND PRINT BUG CHECK ---');
const buggedFiles = fileDetails.filter(d => d.hasTailwindPrintBug);
if (buggedFiles.length === 0) {
    console.log('No files currently have the media="print" Tailwind bug!');
} else {
    console.log(`Found ${buggedFiles.length} files with media="print" Tailwind bug:`);
    buggedFiles.forEach(b => console.log(` - ${b.file}`));
}

// Read sitemap.xml
let sitemapUrls = [];
if (fs.existsSync('sitemap.xml')) {
    const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)];
    sitemapUrls = locMatches.map(m => m[1].trim());
}
console.log('\n--- SITEMAP.XML URLS (' + sitemapUrls.length + ') ---');
sitemapUrls.forEach((u, i) => console.log(`${i + 1}. ${u}`));

// Normalized internal routes from hrefSet
const internalRoutes = new Set();
hrefSet.forEach(h => {
    let raw = h.trim();
    if (raw.startsWith('${basePath}')) {
        raw = raw.replace('${basePath}', '/');
    }
    if (raw.startsWith('tel:') || raw.startsWith('mailto:') || raw.startsWith('#') || raw.startsWith('javascript:')) {
        return;
    }
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        if (raw.includes('constructorabyb.com.ar')) {
            try {
                const u = new URL(raw);
                internalRoutes.add(u.pathname);
            } catch(e) {}
        }
    } else {
        // relative or root-relative
        if (raw.startsWith('/')) {
            internalRoutes.add(raw.split('#')[0].split('?')[0]);
        } else {
            internalRoutes.add('/' + raw.split('#')[0].split('?')[0]);
        }
    }
});

console.log('\n--- INTERNAL ROUTES REFERENCED IN LINKS (' + internalRoutes.size + ') ---');
Array.from(internalRoutes).sort().forEach(r => console.log(r));

// Map all physical HTML files to their expected public URL
const diskUrls = relPaths.map(p => {
    if (p === 'index.html') return 'https://constructorabyb.com.ar/';
    if (p.endsWith('/index.html')) {
        return 'https://constructorabyb.com.ar/' + p.replace(/\/index\.html$/, '/');
    }
    return 'https://constructorabyb.com.ar/' + p;
});

console.log('\n--- URLS CORRESPONDING TO DISK HTML FILES (' + diskUrls.length + ') ---');
diskUrls.forEach((u, i) => console.log(`${i + 1}. ${u}`));

fs.writeFileSync('scripts/scan_summary.json', JSON.stringify({
    htmlFiles: relPaths,
    diskUrls,
    sitemapUrls,
    internalRoutes: Array.from(internalRoutes).sort(),
    canonicalMap,
    fileDetails
}, null, 2));
