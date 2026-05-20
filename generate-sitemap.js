// Generador de Sitemap y Watcher en Tiempo Real para Constructora ByB
// No requiere dependencias externas de npm (usa solo módulos nativos de Node.js)

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://constructorabyb.com.ar';
const ROOT_DIR = __dirname;
const SITEMAP_XML = path.join(ROOT_DIR, 'sitemap.xml');
const SITEMAP_INDEX_XML = path.join(ROOT_DIR, 'sitemap_index.xml');

// Directorios y archivos a excluir de la indexación
const EXCLUDE_DIRS = [
  '.antigravity',
  '.git',
  '.github',
  'components',
  'node_modules',
  'temp',
  'skills'
];

const EXCLUDE_FILES = [
  'sitemap.xml',
  'sitemap_index.xml'
];

/**
 * Escanea recursivamente el directorio en busca de archivos HTML.
 */
function getHtmlFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getHtmlFiles(filePath, filesList);
      }
    } else if (file.endsWith('.html') && !EXCLUDE_FILES.includes(file)) {
      filesList.push({
        filePath,
        mtime: stat.mtime
      });
    }
  }
  return filesList;
}

/**
 * Genera sitemap.xml y sitemap_index.xml basados en la estructura actual del proyecto.
 */
function generate() {
  console.log(`[${new Date().toLocaleTimeString()}] Iniciando generación de sitemaps...`);
  try {
    const htmlFiles = getHtmlFiles(ROOT_DIR);
    const urls = [];

    for (const { filePath, mtime } of htmlFiles) {
      // Calcular la ruta relativa usando barras inclinadas
      let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
      
      // Si es un archivo index.html en una subcarpeta, el URL de la página es simplemente carpeta/
      // Ejemplo: "casa-moderna/index.html" -> "casa-moderna/"
      // Si es el index.html de la raíz -> "" (que se traduce en "/")
      let urlPath = relativePath;
      if (path.basename(filePath) === 'index.html') {
        urlPath = path.dirname(relativePath);
        if (urlPath === '.') {
          urlPath = '';
        } else {
          urlPath = urlPath + '/';
        }
      }

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar si tiene etiqueta noindex en los metadatos de robots
      const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
      if (robotsMatch && robotsMatch[1].toLowerCase().includes('noindex')) {
        console.log(`- Omitiendo página (noindex): ${relativePath}`);
        continue;
      }

      // Determinar la URL (loc): Usar canonical si existe, sino construirla
      let loc = `${BASE_URL}/${urlPath}`;
      const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      if (canonicalMatch) {
        loc = canonicalMatch[1];
      }

      // Formatear fecha de última modificación (YYYY-MM-DD)
      const lastmod = mtime.toISOString().split('T')[0];

      // Determinar prioridad y frecuencia de cambio óptimas para SEO
      let priority = '0.5';
      let changefreq = 'monthly';

      if (urlPath === '') {
        // Página de Inicio
        priority = '1.0';
        changefreq = 'weekly';
      } else if (['contacto/', 'precio-construccion-m2/'].includes(urlPath)) {
        // Conversión y Cotizaciones
        priority = '0.8';
        changefreq = 'monthly';
      } else if (['aviso-legal/', 'politica-privacidad/'].includes(urlPath)) {
        // Páginas Legales
        priority = '0.3';
        changefreq = 'yearly';
      } else {
        // Páginas de servicios específicos y blog
        priority = '0.9';
        changefreq = 'weekly';
      }

      urls.push({ loc, lastmod, changefreq, priority });
    }

    // Ordenar URLs por prioridad descendente y luego alfabéticamente por URL
    urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority) || a.loc.localeCompare(b.loc));

    // 1. Escribir sitemap.xml
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const url of urls) {
      sitemapContent += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
    }
    sitemapContent += `</urlset>\n`;

    fs.writeFileSync(SITEMAP_XML, sitemapContent, 'utf8');
    console.log(`+ sitemap.xml generado correctamente (${urls.length} URLs registradas)`);

    // 2. Escribir sitemap_index.xml
    const today = new Date().toISOString().split('T')[0];
    const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>\n`;

    fs.writeFileSync(SITEMAP_INDEX_XML, sitemapIndexContent, 'utf8');
    console.log('+ sitemap_index.xml generado correctamente');

  } catch (error) {
    console.error('Error al generar los sitemaps:', error);
  }
}

// Analizar argumentos de línea de comandos
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

if (isWatch) {
  console.log(`\n======================================================`);
  console.log(` WATCHER ACTIVADO: Monitoreando cambios en ${ROOT_DIR}`);
  console.log(` Se regenerará el sitemap al crear, borrar o editar archivos .html`);
  console.log(` Presiona Ctrl+C para detener.`);
  console.log(`======================================================\n`);
  
  // Generar inicialmente
  generate();

  let timeoutId = null;
  // Debounce para evitar múltiples ejecuciones en guardados rápidos
  function debounceGenerate() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      generate();
    }, 500);
  }

  // Activar watcher de fs nativo de Node.js de forma recursiva (soportado nativamente en Windows)
  try {
    fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
      if (filename) {
        // Ignorar carpetas excluidas
        const parts = filename.split(path.sep);
        const isExcluded = parts.some(part => EXCLUDE_DIRS.includes(part));
        
        // Evitar bucle infinito ignorando cambios en los propios sitemaps
        if (filename === 'sitemap.xml' || filename === 'sitemap_index.xml') {
          return;
        }

        if (!isExcluded && (filename.endsWith('.html') || filename.endsWith('.htm'))) {
          console.log(`\n[${new Date().toLocaleTimeString()}] Cambio detectado (${eventType}): ${filename}`);
          debounceGenerate();
        }
      }
    });
  } catch (err) {
    console.error('No se pudo iniciar el watcher recursivo. Asegúrate de tener permisos suficientes.', err);
  }
} else {
  generate();
}
