const fs = require('fs');
const path = require('path');

const scan = JSON.parse(fs.readFileSync('scripts/scan_summary.json', 'utf8'));

const report = [];

scan.htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check async CSS bug
    const hasMediaPrintTailwind = /tailwind[^\"]*media=[\"']print[\"']/i.test(content) || /media=[\"']print[\"'][^\"]*tailwind/i.test(content);
    const hasAnyMediaPrintCss = /<link[^>]+rel=[\"']stylesheet[\"'][^>]+media=[\"']print[\"']/i.test(content);

    // Check preconnects
    const preconnects = [...content.matchAll(/<link[^>]+rel=[\"']preconnect[\"'][^>]+href=[\"']([^\"']+)[\"']/gi)].map(m => m[1]);

    // Check hero image / large images
    const imgTags = [...content.matchAll(/<img([^>]+)>/gi)].map(m => m[1]);
    const imgsWithoutDims = [];
    const imgsWithoutAlt = [];
    const imgsWithoutLazy = [];

    imgTags.forEach(tag => {
        const srcMatch = tag.match(/src=[\"']([^\"']+)[\"']/i);
        const src = srcMatch ? srcMatch[1] : 'unknown';
        const hasWidth = /width=[\"']\d+[\"']/i.test(tag);
        const hasHeight = /height=[\"']\d+[\"']/i.test(tag);
        const hasAlt = /alt=[\"'][^\"']*[\"']/i.test(tag);
        const hasLazy = /loading=[\"']lazy[\"']/i.test(tag);
        const isPriority = /fetchpriority=[\"']high[\"']/i.test(tag);

        if (!hasWidth || !hasHeight) imgsWithoutDims.push(src);
        if (!hasAlt) imgsWithoutAlt.push(src);
        if (!hasLazy && !isPriority) imgsWithoutLazy.push(src);
    });

    // Check hero preload
    const hasHeroPreload = /rel=[\"']preload[\"'][^>]+as=[\"']image[\"']/i.test(content);

    // Check material symbols font link
    const hasMaterialSymbolsFull = content.includes('family=Material+Symbols+Outlined:wght,FILL@100..700,0..1');
    const hasMaterialSymbolsSubset = content.includes('icon_names=');

    report.push({
        file,
        canonical: scan.canonicalMap[file],
        hasMediaPrintTailwind,
        hasAnyMediaPrintCss,
        preconnects,
        totalImages: imgTags.length,
        imgsWithoutDimsCount: imgsWithoutDims.length,
        imgsWithoutDims: imgsWithoutDims.slice(0, 3),
        hasHeroPreload,
        materialSymbols: hasMaterialSymbolsSubset ? 'subset' : (hasMaterialSymbolsFull ? 'full' : 'none_or_other')
    });
});

console.log(JSON.stringify(report, null, 2));
fs.writeFileSync('scripts/files_optimization_status.json', JSON.stringify(report, null, 2));
