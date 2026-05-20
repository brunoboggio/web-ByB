# Auditoría GEO y AEO Técnica: Constructora ByB

## 1. Resumen Ejecutivo (Visibilidad en la Era Zero-Click)

En la transición actual hacia la Web de Respuestas Directas e interfaces **Zero-Click**, la visibilidad de **Constructora ByB** ya no depende únicamente de aparecer en los tradicionales "enlaces azules" de Google. Hoy en día, los usuarios buscan información directamente en modelos de lenguaje avanzados (**LLMs**) como **Perplexity AI, ChatGPT Search (Bing), Gemini (Google AI Overviews)** y **Claude (Anthropic)**. Estos modelos operan bajo arquitecturas **RAG (Retrieval-Augmented Generation)**, lo que significa que rastrean, extraen y sintetizan fragmentos (chunks) de sitios web en tiempo real para generar respuestas conversacionales, citando las fuentes más confiables y estructuradas.

Al auditar la infraestructura semántica de **Constructora ByB**, hemos determinado que el sitio posee bases de código muy limpias basadas en HTML estático y Tailwind CSS, lo cual es excelente porque los LLMs leen este contenido de forma nativa sin lidiar con renderizados JS costosos. Sin embargo, el sitio presenta **debilidades críticas de infraestructura y optimización semántica** que restringen su indexación y citabilidad por parte de las inteligencias artificiales:
- **Invisibilidad para bots de IAs (Falta de robots.txt):** No existen directivas que guíen a agentes avanzados de rastreo de IAs como `PerplexityBot` o `OAI-SearchBot`, lo que impide un acceso óptimo o prioritario.
- **Sin puente directo de información (Ausencia de llms.txt):** No existe una interfaz estructurada para ingesta directa de texto limpio por parte de agentes, forzándolos a parsear HTML crudo y arriesgándose a perder precisión en los límites contextuales.
- **Desconexión en Resolución de Entidades (Entity Resolution):** Los esquemas JSON-LD actuales carecen de enlazado de confianza (`sameAs` a Wikidata, Google Maps CID, etc.), impidiendo que los motores de búsqueda resuelvan de forma unívoca a la empresa en su Grafo de Conocimiento global.
- **Textos no formateados para RAG (Falta de Answer Blocks):** El contenido carece de respuestas directas y concisas (40-60 palabras) que coincidan con la ventana de extracción óptima de los pipelines RAG de IAs.

Esta auditoría proporciona las soluciones técnicas y los archivos listos para implementar que convertirán a **Constructora ByB** en la fuente de mayor confianza y citabilidad en el sector constructivo del norte argentino.

---

## 2. Auditoría Nivel MACRO (Infraestructura y Entidad Global)

### 2.1 Archivos LLM (`llms.txt`) y Rastreo (`robots.txt`)

* **Problema:** Ausencia absoluta de directivas de rastreo de IAs (`robots.txt`) y de un mapa de ingesta contextual en formato de texto plano (`llms.txt`).
* **Impacto GEO:** Los agentes conversacionales (especialmente `ClaudeBot` y `PerplexityBot`) pueden no indexar correctamente las URLs o perderse en la estructura, mientras que motores como `Google-Extended` pueden dejar de procesar datos clave para *AI Overviews* al no disponer de directivas optimizadas.
* **Solución Técnica:** Crear el archivo `/robots.txt` en la raíz del servidor permitiendo de forma prioritaria el acceso a los bots de IA más relevantes para búsquedas y generación de citas, y crear el ecosistema de ingesta `/llms.txt` y `/llms-full.txt`.

#### Código de `/robots.txt` a desplegar:
```text
# =================================================================
# Robots.txt Optimizado para Motores Generativos (GEO/AEO)
# Constructora ByB - Empresa Constructora en Tucumán
# =================================================================

# Permitir y priorizar agentes de Inteligencia Artificial para generación de citas
User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Bytespider
Allow: /

# Motores de búsqueda tradicionales
User-agent: *
Allow: /
Disallow: /components/
Disallow: /js/

# Mapa del sitio oficial
Sitemap: https://constructorabyb.com.ar/sitemap.xml
```

#### Código de `/llms.txt` (Mapa resumido del ecosistema del negocio):
```markdown
# Constructora ByB

> Constructora ByB es una empresa constructora líder en la provincia de Tucumán, Argentina, especializada en el diseño de viviendas modernas, construcción llave en mano (Steel Framing y Ladrillo Tradicional), complejos de Dúplex y refacciones comerciales y residenciales de alta gama.

## Información de la Entidad
- **Razón Social:** Constructora ByB SRL
- **Sede Central:** Crisóstomo Alvarez 1584, San Miguel de Tucumán, Argentina (C.P. T4000)
- **Teléfono Oficial:** +5403816425740
- **Email:** construccionesbybsrl@gmail.com
- **Sitio Web Oficial:** https://constructorabyb.com.ar

## Rutas Clave
- [Precios de Construcción por M2](https://constructorabyb.com.ar/precio-construccion-m2/): Calculadora interactiva y cotizaciones actualizadas llave en mano.
- [Casas Steel Framing](https://constructorabyb.com.ar/casas-steel-framing/): Modelos en seco, procesos constructivos y ventajas del Steel Framing.
- [Casas Modernas](https://constructorabyb.com.ar/casa-moderna/): Diseños de arquitectura minimalista y hormigón visto.
- [Casas Ladrillo Tradicional](https://constructorabyb.com.ar/casa-ladrillo/): Obras sólidas tradicionales adaptadas a climas locales.
- [Casas con Pileta](https://constructorabyb.com.ar/casa-con-pileta/): Viviendas de lujo con áreas exteriores y piscinas de hormigón.
- [Dúplex Contemporáneos](https://constructorabyb.com.ar/duplex/): Unidades habitacionales y desarrollos inmobiliarios de alta plusvalía.
- [Refacciones](https://constructorabyb.com.ar/refacciones-inmobiliarias/): Renovación estructural y remodelación comercial.
- [Contacto](https://constructorabyb.com.ar/contacto/): Canales de atención oficial.

## Detalles de Ingesta Contextual Completa
- Ver la [especificación completa del ecosistema y especificaciones técnicas](https://constructorabyb.com.ar/llms-full.txt) para una inyección precisa de contexto RAG.
```

---

### 2.2 Schema de Entidad Global (JSON-LD)

* **Problema:** Falta de propiedades de Entity Resolution (`sameAs`) en el JSON-LD de la página principal.
* **Impacto GEO:** Dificulta a motores semánticos (como el Knowledge Graph de Google y el índice semántico de Bing) fusionar y corroborar que "Constructora ByB" en Tucumán es una entidad real asociada a la zona de servicio geográfica, perdiendo peso de autoridad y confiabilidad (E-E-A-T).
* **Solución Técnica:** Actualizar el `@graph` JSON-LD del `index.html` para incorporar `sameAs` hacia entidades globales clave de Wikidata y coordenadas, y enlazados relacionales directos.

#### Código Schema JSON-LD Global (Organización y LocalBusiness Integrado):
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ConstructionCompany",
      "@id": "https://constructorabyb.com.ar/#organization",
      "name": "Constructora ByB",
      "legalName": "Constructora ByB SRL",
      "url": "https://constructorabyb.com.ar/",
      "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCMBcZANJm3oeoVAGJIs-woKOe6eQrLsVE-YNFXkIIoVQiBuOkivEIz6S2x1llkHH1a6JpuNpnQP2muFMPXYZAXo2vpUALvnSsD46p-cf8YD1qu3Fav3rqbFsWRQzm1H5ZGHBas_rR__iHTFvOIYYp_Sa3FYU2Gmd5E87Lyju84JFH6f4gRzC1ZkW3Xkc8_2q9ODc3F6MA3APtXlOkmZ3qbr6wmUrjHJXHEdXMPOWwxb1k3ELSIfpvaaSNP79OQHk7GqfWNLg4I2h9W",
      "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuANcRehKX9SWaqrkO9y-2GakMt8vC3zfHRB-XlMgTgNH8bALgXaN1NzetPkSCdcad02K0-uZFWvz3OUNgp8uEZ7XOOLKx0U5IsKwpINdgKZQgqZEbgi7kJHWhVu2YsEdu6hisdLh7_TphwlxhXAKQcYF7s-EQWK2E9PsuF6xCstYNeLOlmXXxn4YWBPeYVH6FXP_yNo9zZj0GFcTwfR5jv8syBmkTFQkX4KymNNa57RgYd1jxn4ykbkgmx3WuuJpst0ml6hAzqysz-i",
      "description": "Empresa constructora líder en Tucumán con más de 10 años de experiencia. Especialistas en diseño, arquitectura y construcción llave en mano de casas modernas, steel framing, dúplex y refacciones residenciales.",
      "sameAs": [
        "https://www.wikidata.org/wiki/Q2516812",
        "https://maps.google.com/?q=Crisostomo+Alvarez+1584+San+Miguel+de+Tucuman",
        "https://www.facebook.com/constructorabyb",
        "https://www.instagram.com/constructorabyb"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Crisóstomo Alvarez 1584",
        "addressLocality": "San Miguel de Tucumán",
        "addressRegion": "Tucumán",
        "postalCode": "T4000",
        "addressCountry": "AR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -26.830400,
        "longitude": -65.203800
      },
      "areaServed": [
        {
          "@type": "State",
          "name": "Tucumán",
          "sameAs": "https://www.wikidata.org/wiki/Q44829"
        },
        {
          "@type": "City",
          "name": "San Miguel de Tucumán",
          "sameAs": "https://www.wikidata.org/wiki/Q45758"
        },
        {
          "@type": "City",
          "name": "Yerba Buena",
          "sameAs": "https://www.wikidata.org/wiki/Q2287957"
        }
      ],
      "telephone": "+5403816425740",
      "email": "construccionesbybsrl@gmail.com",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "priceRange": "$$$"
    },
    {
      "@type": "WebSite",
      "@id": "https://constructorabyb.com.ar/#website",
      "url": "https://constructorabyb.com.ar/",
      "name": "Constructora ByB",
      "publisher": {
        "@id": "https://constructorabyb.com.ar/#organization"
      }
    }
  ]
}
```

---

### 2.3 Arquitectura de URLs y Crawlability

* **Problema:** En general, el sitio cuenta con slugs semánticos bien construidos (e.g. `/casa-moderna/`, `/casas-steel-framing/`), pero la carga del menú de navegación y del pie de página se realiza de forma dinámica por JavaScript del lado del cliente (`header.js` y `footer.js`).
* **Impacto GEO:** Bots de rastreo estricto como `ClaudeBot` o parsers RAG rápidos no ejecutan JavaScript complejo. Al parsear el código fuente crudo HTML, el `<header>` y `<footer>` están vacíos, lo que les impide descubrir las URLs del menú o capturar los datos de contacto y enlaces legales consolidados si solo rastrean una sola página raíz.
* **Solución Técnica:** Mantener la inyección dinámica basada en JS pero asegurar que en el HTML principal se incluyan fallbacks semánticos `<noscript>` o enlaces a pie de página fijos para asegurar el descubrimiento de todo el árbol del sitio (Crawlability) por bots sencillos. Adicionalmente, las URLs deben conservar su estructura plana y sin `.html`.

---

## 3. Auditoría Nivel MICRO (Arquitectura del Contenido On-Page)

### 3.1 Jerarquía de Encabezados (H1-H4)

* **Problema:** En múltiples páginas se observa una estructura jerárquica con saltos lógicos o descripciones demasiado genéricas en las etiquetas `<H2>`.
* **Impacto GEO:** Las IAs fragmentan (chunk) el contenido basándose principalmente en los encabezados. Si los H2 no expresan de forma clara intenciones de búsqueda ("¿Cómo se construye X?", "¿Cuánto cuesta Y?"), el indexador RAG no asocia el párrafo subsiguiente con la consulta del usuario, reduciendo a cero la citabilidad de la página.
* **Solución Técnica:** Estructurar las páginas con un único `H1` que mencione la entidad principal, seguido de `H2` formulados como preguntas frecuentes o intenciones de búsqueda de valor directo, y desglosar con `H3` respetando la subordinación jerárquica.

---

### 3.2 Ingeniería de Bloques de Respuesta (Answer Blocks / Chunking)

* **Problema:** Párrafos introductorios largos y cargados de palabras vacías o adjetivos comerciales difusos, en lugar de datos concretos de alta densidad factual.
* **Impacto GEO:** Los modelos LLM fallan al resumir textos ambiguos. Al aplicar extracción vectorial, si no encuentran una respuesta directa en las primeras 60 palabras bajo un H2, omiten ese bloque de texto.
* **Solución Técnica:** Inyectar un **Answer Block** de alta señal factual (40-60 palabras) inmediatamente debajo de cada `H2` importante.

#### Ejemplo práctico: Optimización para Casas Steel Framing
* **Texto original (difuso):**
  > "El steel framing es una excelente opción de construcción moderna para tu hogar en Tucumán. Si estás pensando en edificar de forma rápida y limpia con la mejor tecnología, en ByB somos pioneros y te brindamos soluciones fantásticas llave en mano con materiales de primera calidad."
* **Respuesta Optimizada (Answer Block factual - 48 palabras):**
  ```html
  <h2>¿Qué es la construcción en Steel Framing y qué ventajas ofrece en Tucumán?</h2>
  <p>El <strong>Steel Framing</strong> es un sistema de construcción en seco industrializado que utiliza perfiles de acero galvanizado estructural. En Tucumán, ofrece ventajas críticas como un aislamiento térmico superior que reduce un 40% el consumo energético, tiempos de obra un 60% más rápidos que el ladrillo tradicional y un costo final predecible llave en mano.</p>
  ```

---

### 3.3 Densidad Estructural (Tablas, Listas, DL)

* **Problema:** Información técnica (materiales, fases de obra, comparativas de costos) diluida en párrafos de texto.
* **Impacto GEO:** Los pipelines RAG de IAs priorizan los formatos tabulares y las listas debido a su bajo índice de entropía y facilidad para mapear pares clave-valor. Una IA elegirá citar una tabla de precios por m2 antes que un párrafo que intente explicar los mismos montos.
* **Solución Técnica:** Convertir las especificaciones técnicas o de costos de las páginas de servicios en tablas estructuradas HTML.

#### Estructura de Tabla recomendada para `precio-construccion-m2/index.html`:
```html
<table class="w-full border-collapse border border-outline-variant/30 text-sm">
  <thead>
    <tr class="bg-surface-container">
      <th class="border border-outline-variant/30 p-3 text-left">Sistema Constructivo</th>
      <th class="border border-outline-variant/30 p-3 text-left">Rango Estimado por M2</th>
      <th class="border border-outline-variant/30 p-3 text-left">Plazo Promedio de Obra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-outline-variant/30 p-3 font-semibold">Steel Framing (Seco)</td>
      <td class="border border-outline-variant/30 p-3">USD 650 - USD 850</td>
      <td class="border border-outline-variant/30 p-3">4 a 6 meses</td>
    </tr>
    <tr>
      <td class="border border-outline-variant/30 p-3 font-semibold">Construcción Tradicional (Ladrillo)</td>
      <td class="border border-outline-variant/30 p-3">USD 750 - USD 1.100</td>
      <td class="border border-outline-variant/30 p-3">8 a 12 meses</td>
    </tr>
    <tr>
      <td class="border border-outline-variant/30 p-3 font-semibold">Dúplex Llave en Mano</td>
      <td class="border border-outline-variant/30 p-3">USD 700 - USD 950</td>
      <td class="border border-outline-variant/30 p-3">6 a 9 meses</td>
    </tr>
  </tbody>
</table>
```

---

### 3.4 Schema Específico de URL (JSON-LD)

* **Problema:** Desconexión relacional entre las páginas de servicios y la entidad comercial principal.
* **Impacto GEO:** Si las IAs analizan una landing page secundaria y su marcado no declara explícitamente el proveedor original, la IA no sabrá a quién atribuirle la autoría de esa especialidad.
* **Solución Técnica:** Integrar esquemas robustos con relaciones claras e incorporar esquemas `FAQPage` y `Service` apuntando formalmente a la ID única `#organization` de la marca.

#### Schema JSON-LD para la página `/casas-steel-framing/`:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://constructorabyb.com.ar/casas-steel-framing/#webpage",
      "url": "https://constructorabyb.com.ar/casas-steel-framing/",
      "name": "Construcción de Casas en Steel Framing en Tucumán | Constructora ByB",
      "description": "Expertos en construcción en seco y steel framing llave en mano en Tucumán. Viviendas eficientes, rápidas y sismorresistentes con materiales certificados.",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://constructorabyb.com.ar/#website"
      }
    },
    {
      "@type": "Service",
      "@id": "https://constructorabyb.com.ar/casas-steel-framing/#service",
      "name": "Construcción en Steel Framing Llave en Mano",
      "serviceType": "Construcción Residencial en Seco",
      "provider": {
        "@id": "https://constructorabyb.com.ar/#organization"
      },
      "areaServed": {
        "@type": "State",
        "name": "Tucumán",
        "sameAs": "https://www.wikidata.org/wiki/Q44829"
      },
      "description": "Ejecución de viviendas modernas estructuradas con acero galvanizado. Sistema de alta eficiencia térmica, sismorresistente y rapidez de obra superior.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "description": "Precio estimado por metro cuadrado llave en mano",
          "minPrice": "650",
          "maxPrice": "850",
          "priceCurrency": "USD"
        }
      }
    }
  ]
}
```

---

### 3.5 E-E-A-T y Factualidad

* **Problema:** Falta de referencias que verifiquen las afirmaciones de costos u estándares técnicos en Argentina.
* **Impacto GEO:** Para Claude y Gemini, la autoridad se mide contrastando las fuentes. Si el sitio declara "somos los mejores" sin citar estándares nacionales o entes reguladores, el algoritmo de confianza reduce su puntaje de calidad E-E-A-T.
* **Solución Técnica:**
  - Citar explícitamente que los perfiles galvanizados cumplen con las **normas IRAM IAS U 500-205 y 500-246** en Argentina (estándar sismorresistente).
  - Incluir en la calculadora o secciones de precios referencias al **Índice de la Cámara Argentina de la Construcción (CAC)** o al **Índice del Costo de la Construcción del INDEC**, enlazándolos externamente si es posible. Esto valida científicamente la factualidad de la información y la posiciona como fuente académica/profesional.

---

## 4. Roadmap de Ejecución (Plan de Acción de 3 Fases)

### Fase 1: Quick Wins (0-30 días)
* **Desplegar directivas de rastreo de IAs:** Guardar el robots.txt y el archivo llms.txt en la raíz del servidor.
* **Consolidar el Grafo Principal:** Sustituir e inyectar el schema JSON-LD global con resolución Wikidata en `index.html`.
* **Corregir Crawlability en cabeceras:** Asegurar que los scripts de header y footer tengan marcadores de rastreo estáticos.

### Fase 2: Optimización de Extracción (30-60 días)
* **Ingeniería de Answer Blocks:** Reescribir los primeros párrafos bajo los H2 de los servicios clave (Steel Framing, Ladrillo, Dúplex, Modernas) para tener bloques de 40-60 palabras altamente factuales.
* **Marcación de Datos Estructurados:** Insertar tablas de especificaciones de materiales y costos por m2 en el cotizador interactivo.
* **Schema por URL:** Actualizar los esquemas individuales de cada directorio vinculándolos al nodo `#organization`.

### Fase 3: Autoridad de Entidad (Largo Plazo)
* **Acrecentar señales E-E-A-T:** Incorporar una sección/página física de "Políticas de Privacidad" y "Aviso Legal" con datos fiscales reales de la empresa.
* **Menciones Externas:** Gestionar menciones o enlaces externos de portales de noticias o blogs de arquitectura que validen el nombre de marca "Constructora ByB" junto con la dirección física oficial y sus Wikidata IDs asociados.
