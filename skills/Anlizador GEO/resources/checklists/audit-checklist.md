# Checklist de Auditoría GEO/AEO

> Usa esta checklist durante cada auditoría para no omitir ningún punto crítico.

## Nivel MACRO — Infraestructura Global

### Archivos LLM
- [ ] Existe `/llms.txt` en la raíz del dominio
- [ ] Existe `/llms-full.txt` con documentación extendida
- [ ] Existe `/llms-ctx.txt` con contexto de entidad

### robots.txt
- [ ] Existe `/robots.txt`
- [ ] `PerplexityBot` NO está bloqueado
- [ ] `OAI-SearchBot` NO está bloqueado
- [ ] `ChatGPT-User` NO está bloqueado
- [ ] `ClaudeBot` NO está bloqueado
- [ ] `Google-Extended` NO está bloqueado
- [ ] Incluye referencia al `Sitemap`

### Schema JSON-LD Global
- [ ] Existe esquema `Organization` o `LocalBusiness`
- [ ] Incluye `@id` para referencia cruzada
- [ ] Incluye `sameAs` con perfiles verificados
- [ ] Incluye `areaServed` y `geo` (para GEO Local)
- [ ] Existe esquema `WebSite` con `publisher`

### Arquitectura de URLs
- [ ] URLs usan guiones medios (`-`)
- [ ] URLs en minúsculas
- [ ] Sin parámetros dinámicos
- [ ] Keyword a la izquierda

### Crawlability
- [ ] Contenido visible SIN JavaScript
- [ ] LCP < 2.5 segundos
- [ ] Existe `sitemap.xml`

## Nivel MICRO — Contenido On-Page

### Jerarquía Semántica
- [ ] Un único `<H1>` por página
- [ ] `<H2>` formulan preguntas/intenciones
- [ ] Sin saltos de jerarquía

### Answer Blocks
- [ ] Cada `<H2>` tiene párrafo de 40-60 palabras debajo
- [ ] Párrafos directos y factuales

### Formatos Extraíbles
- [ ] Comparativas en `<table>`
- [ ] Listas en `<ul>` / `<ol>`
- [ ] FAQs con `<details>` + `<summary>`

### Schema por URL
- [ ] FAQPage para páginas con FAQ
- [ ] Service para servicios
- [ ] BreadcrumbList para navegación

### E-E-A-T
- [ ] Autor identificado
- [ ] Fecha de actualización visible
- [ ] Referencias a fuentes externas

### Imágenes
- [ ] Atributos `alt` descriptivos (no keyword stuffing)
- [ ] Formatos modernos (WebP/AVIF)

### Meta Tags
- [ ] `<title>` único (50-60 chars)
- [ ] `<meta description>` (150-160 chars)
- [ ] `<link rel="canonical">`
- [ ] Open Graph tags completos
