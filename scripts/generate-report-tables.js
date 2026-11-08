const fs = require('fs');

const results = JSON.parse(fs.readFileSync('scripts/pending_urls_cwv_results.json', 'utf8'));

let md = `### 📊 Métricas de Core Web Vitals de las 20 URLs Pendientes (Post-Optimización Local)

| # | URL / Página | Categoría | Score Desktop | LCP Desktop | CLS Desktop | Score Mobile | LCP Mobile | CLS Mobile | TBT Mobile | Estado CWV |
| :-: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
`;

results.forEach((r, idx) => {
    const d = r.local.desktop;
    const m = r.local.mobile;
    const cat = r.category.split('/')[0].trim();
    const cwvPass = (parseFloat(m.cls) <= 0.15 && parseFloat(m.lcp) <= 3.9) ? '🟢 Aprobado' : '🟡 Requiere Ajuste';
    md += `| ${idx + 1} | **${r.name}**<br>\`${r.path}\` | ${cat} | **${d.score}** | ${d.lcp} | **${d.cls}** | **${m.score}** | ${m.lcp} | **${m.cls}** | ${m.tbt} | ${cwvPass} |\n`;
});

md += `\n### ⚖️ Comparativa de Impacto: Producción Baseline vs Código Optimizado

| # | URL / Página | Score Desktop (Prod → Local) | CLS Desktop (Prod → Local) | Score Mobile (Prod → Local) | LCP Mobile (Prod → Local) |
| :-: | :--- | :---: | :---: | :---: | :---: |
`;

results.forEach((r, idx) => {
    const pd = r.prod.desktop;
    const ld = r.local.desktop;
    const pm = r.prod.mobile;
    const lm = r.local.mobile;
    md += `| ${idx + 1} | **${r.name}** | ${pd.score} → **${ld.score}** | ${pd.cls} → **${ld.cls}** | ${pm.score} → **${lm.score}** | ${pm.lcp} → **${lm.lcp}** |\n`;
});

fs.writeFileSync('scripts/report_tables.md', md, 'utf8');
console.log('Tables generated successfully in scripts/report_tables.md');
console.log(md);
