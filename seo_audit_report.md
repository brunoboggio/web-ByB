# Informe de Auditoría SEO Profesional: Constructora ByB

Este informe presenta los resultados de la auditoría de optimización para motores de búsqueda (SEO) realizada sobre el sitio web de **Constructora ByB** (https://constructorabyb.com.ar/). La auditoría abarca la infraestructura técnica, el SEO on-page, la arquitectura del contenido y las señales de autoridad local y E-E-A-T.

---

## 1. Resumen Ejecutivo

El sitio web de **Constructora ByB** presenta una infraestructura técnica base sumamente sólida. Al ser un desarrollo en HTML estático estructurado con Tailwind CSS, posee ventajas de velocidad nativas excepcionales y una alta legibilidad para rastreadores (incluyendo bots de búsqueda tradicionales y agentes de ingesta de modelos de lenguaje/IAs).

### Indicadores de Salud SEO
- **Rastreabilidad y Descubrimiento:** **Excelente (100%)**. Todas las 25 páginas físicas del proyecto están debidamente declaradas en el `sitemap.xml`, y el archivo `robots.txt` cuenta con directivas optimizadas tanto para buscadores tradicionales como para agentes generativos (GEO).
- **Indexación y Redirección:** **Excelente (100%)**. Se encontraron etiquetas canonicals auto-referenciales consistentes y protocolos HTTPS correctos en todo el árbol de directorios.
- **Enlaces Internos y Recursos:** **Excelente (100%)**. Una verificación a nivel de servidor de todos los enlaces internos (`href`) y recursos gráficos (`src`) demuestra que **no existen enlaces rotos ni imágenes caídas** dentro de la estructura local del proyecto.
- **SEO On-Page y Metadatos:** **Regular**. Existe una discrepancia sistemática en la longitud de las etiquetas `<title>` y `<meta name="description">` que superan los límites visibles en las páginas de resultados de búsqueda (SERP).
- **Estructura Semántica de Encabezados:** **Mala**. Se detectaron saltos de nivel jerárquico (típicamente de H2 a H4) en 15 de las 25 páginas analizadas, lo cual perjudica el SEO de accesibilidad y la indexación por fragmentos (chunking) en motores de búsqueda de IA.

---

## 2. Auditoría de SEO Técnico

### 2.1 Rastreabilidad (Crawlability) y Indexabilidad
- **Robots.txt:** El archivo está optimizado para proteger directorios de desarrollo (`/components/`, `/js/`) y declarar correctamente la ruta al índice del mapa del sitio (`sitemap_index.xml`). Incluye directivas específicas de rastreo prioritario para `PerplexityBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot` y `Google-Extended`.
- **Sitemaps:** El sitio implementa un sitemap index que apunta correctamente al sitemap secundario, el cual incluye las 25 páginas vigentes. La frecuencia de cambio y prioridades están configuradas con lógica de negocio adecuada (viviendas y servicios con prioridad 0.9, contacto/precios con 0.8, políticas con 0.3).
- **Menú Dinámico y Pie de Página (JS Rendering Fallback):**
  - **Fortaleza:** La navegación y el pie de página principal se inyectan a través de `header.js` y `footer.js` para simplificar el mantenimiento.
  - **Solución implementada:** Cada archivo HTML contiene un bloque `<noscript>` con el menú de navegación y los datos de contacto estáticos equivalentes. Esto asegura que los rastreadores simples que no ejecutan JavaScript (como `ClaudeBot`) puedan descubrir todo el árbol del sitio y leer la información corporativa sin problemas.

### 2.2 Canonicalización
- Cada página cuenta con una etiqueta `<link rel="canonical">` auto-referencial absoluta con formato HTTPS y barra diagonal final (`/`) consistente (e.g., `https://constructorabyb.com.ar/casa-moderna/`). Esto evita problemas de contenido duplicado y consolidación de backlinks.

---

## 3. Auditoría de SEO On-Page

### 3.1 Longitud y Optimización de Etiquetas Title
Las etiquetas `<title>` deben tener una longitud óptima de **50 a 60 caracteres**. Títulos más largos se truncan en la SERP de Google, perdiendo legibilidad y afectando negativamente el CTR (Click-Through Rate).

| Ruta de Página (`.html`) | Título Actual | Longitud | Diagnóstico y Recomendación |
| :--- | :--- | :---: | :--- |
| `casa-con-pileta/` | Casas con Pileta en Tucumán \| Diseño y Construcción Integral \| Constructora ByB | **79** | **Muy largo**. Truncado en SERP. Cambiar a: `Casas con Pileta en Tucumán \| Constructora ByB` (49 c.) |
| `casa-country/` | Diseño y Construcción de Casas de Country en Tucumán \| Constructora ByB | **71** | **Largo**. Truncado. Cambiar a: `Construcción de Casas de Country en Tucumán \| ByB` (52 c.) |
| `casa-ladrillo/` | Casas de Ladrillo Visto en Tucumán \| Calidez y Solidez \| Constructora ByB | **73** | **Largo**. Truncado. Cambiar a: `Casas de Ladrillo Visto en Tucumán \| Constructora ByB` (53 c.) |
| `casa-moderna/` | Casas Modernas en Tucumán \| Arquitectura y Diseño \| Constructora ByB | **68** | **Ligeramente largo**. Cambiar a: `Casas Modernas en Tucumán \| Constructora ByB` (44 c.) |
| `casas-steel-framing/ahorro-energetico/` | Ahorro Energético con Steel Framing \| Casas Eficientes Clase A \| Constructora ByB | **81** | **Muy largo**. Cambiar a: `Ahorro Energético con Steel Framing \| Constructora ByB` (53 c.) |
| `casas-steel-framing/` | Casas Steel Framing en Tucumán \| Construcción Eficiente y Rápida \| Constructora ByB | **83** | **Muy largo**. Cambiar a: `Casas Steel Framing en Tucumán \| Constructora ByB` (48 c.) |
| `casas-steel-framing/sistema/` | Sistema de Construcción Steel Framing \| Cómo Funciona \| Constructora ByB | **72** | **Largo**. Cambiar a: `Cómo Funciona el Steel Framing \| Constructora ByB` (47 c.) |
| `casas-steel-framing/steel-framing-vs-construccion-tradicional/` | Steel Framing vs. Construcción Tradicional \| Comparativa Real \| Constructora ByB | **80** | **Muy largo**. Cambiar a: `Steel Framing vs. Tradicional: Comparativa \| ByB` (49 c.) |
| `casas-steel-framing/ventajas-desventajas/` | Ventajas y Desventajas del Steel Framing \| Guía Técnica Interactiva \| Constructora ByB | **86** | **Muy largo**. Cambiar a: `Ventajas y Desventajas del Steel Framing \| ByB` (47 c.) |
| `construccion-en-seco/` | Sistema de Construcción en Seco: Precios, Materiales y Usos \| Constructora ByB | **78** | **Largo**. Cambiar a: `Construcción en Seco en Tucumán \| Constructora ByB` (49 c.) |
| `mejores-tipos-de-techos/` | Tipos de Techos para Casas: Materiales, Ventajas y Costos \| Constructora ByB | **76** | **Largo**. Cambiar a: `Tipos de Techos para Casas: Guía \| Constructora ByB` (52 c.) |
| `refacciones-inmobiliarias/aumentar-valor-vivienda/` | ¿Cómo Aumentar el Valor de tu Vivienda con Pequeñas Reformas? \| Constructora ByB | **80** | **Muy largo**. Cambiar a: `¿Cómo Aumentar el Valor de tu Vivienda? \| ByB` (44 c.) |
| `refacciones-inmobiliarias/` | Refacciones del Hogar y Remodelaciones Integrales en Tucumán \| Constructora ByB | **79** | **Muy largo**. Cambiar a: `Refacciones y Remodelaciones en Tucumán \| ByB` (46 c.) |
| `tipos-de-suelos/` | Tipos de Suelos para Casas: Guía de Pisos y Revestimientos \| Constructora ByB | **77** | **Largo**. Cambiar a: `Tipos de Suelos y Pisos para Casas \| Constructora ByB` (51 c.) |

---

### 3.2 Longitud y Optimización de Meta-Descriptions
Las descripciones cortas deben tener entre **120 y 160 caracteres** para optimizar el porcentaje de clics (CTR) en las búsquedas móviles y de escritorio.

| Ruta de Página | Descripción Actual | Longitud | Diagnóstico y Recomendación |
| :--- | :--- | :---: | :--- |
| `index.html` (Home) | Constructora ByB es una empresa constructora líder en Tucumán con más de 10 años de experiencia. Especialistas en casas modernas, proyectos llave en mano, dúplex y refacciones. Solicite su presupuesto. | **201** | **Muy larga (supera los 160 c.)**. Modificar a: `Constructora ByB: Empresa líder en Tucumán. Especialistas en casas modernas, dúplex y refacciones llave en mano. Solicite su presupuesto hoy.` (154 c.) |
| `casa-ladrillo/` | Especialistas en diseño y construcción de Casas de Ladrillo Visto en Tucumán. Fusión de estilo rústico moderno, excelente inercia térmica y nulo mantenimiento. Modalidad llave en mano. | **184** | **Larga**. Modificar a: `Construcción de casas de ladrillo visto en Tucumán. Estilo rústico moderno, excelente inercia térmica y nulo mantenimiento. Obra llave en mano.` (151 c.) |
| `casa-moderna/` | Especialistas en el diseño y construcción de Casas Modernas en Tucumán. Volúmenes puros, paños vidriados, hormigón visto y máxima integración espacial. Modalidad llave en mano. | **176** | **Larga**. Modificar a: `Diseño y construcción de casas modernas en Tucumán. Volúmenes puros, hormigón visto y máxima integración espacial. Obra llave en mano llave en mano.` (148 c.) |
| `refacciones-inmobiliarias/` | Transforme su hogar en Tucumán con precisión arquitectónica. Especialistas en refacciones integrales de cocinas, baños y ampliaciones de alta gama con la Garantía de Constructora ByB. Solicite cotización gratis. | **211** | **Crítico (muy larga)**. Reducir a: `Refacciones del hogar y remodelaciones integrales en Tucumán. Reformas de cocinas, baños y ampliaciones premium llave en mano. Presupuesto gratis.` (151 c.) |
| `refacciones-inmobiliarias/aumentar-valor-vivienda/` | Descubra cómo revalorizar su propiedad entre un 10% y un 25% en Tucumán con reformas parciales estratégicas. Cocinas, baños, pintura e iluminación con la dirección experta de Constructora ByB. | **192** | **Muy larga**. Reducir a: `Descubra cómo revalorizar su propiedad en Tucumán con reformas parciales estratégicas de cocinas, baños y pintura. Consejos de Constructora ByB.` (151 c.) |
| `credito-hipotecario/` | Obtenga su crédito hipotecario para construcción en Tucumán y Yerba Buena. Le brindamos asesoramiento experto y toda la documentación técnica para la aprobación de su préstamo bancario. | **185** | **Muy larga**. Reducir a: `Asesoramiento y carpeta técnica para la aprobación de su crédito hipotecario de construcción en Tucumán y Yerba Buena. Construya su casa hoy.` (147 c.) |
| `duplex/` | Expertos en construcción de dúplex modernos y minimalistas en Tucumán. Proyectos llave en mano, diseño arquitectónico de vanguardia y máxima rentabilidad. ¡Pida su presupuesto hoy! | **180** | **Muy larga**. Reducir a: `Construcción de dúplex modernos y minimalistas en Tucumán. Diseños llave en mano de alta rentabilidad y vanguardia. Solicite presupuesto hoy.` (146 c.) |
| `mejores-tipos-de-techos/` | Guía profesional sobre los mejores tipos de techos para tu casa en Argentina. Comparativa de techos de chapa, losa, tejas y madera. Aislamiento térmico, costos y consejos para elegir. | **183** | **Muy larga**. Reducir a: `Comparativa de los mejores tipos de techos para casas en Argentina: chapa, losa, tejas y madera. Consejos de aislamiento, costos y durabilidad.` (148 c.) |

---

### 3.3 Estructura Semántica de Encabezados (Hierarchy Break)
El uso sistemático y ordenado de los encabezados (H1, H2, H3, H4) es crucial para estructurar el contenido de cara a los algoritmos de indexación de Google y la extracción semántica (chunking) de las IAs generativas (motores AEO/GEO).

**Hallazgo Crítico:** 15 páginas presentan saltos inválidos de **H2 directamente a H4** sin pasar por **H3**. Los motores de búsqueda interpretan esto como una mala práctica de diseño web, donde se usan encabezados grandes (`H4`) únicamente por razones de estilo estético (visual) en lugar de una jerarquía de contenido lógica.

#### Páginas con saltos jerárquicos y encabezados afectados:
1. **`aviso-legal/index.html` y `politica-privacidad/index.html`**
   - Salto de `H1` a `H3` en el contenedor lateral ("SECCIONES"). Debería ser un tag `H2` o simplemente un elemento de lista estilizado con CSS sin rol semántico de cabecera.
2. **`calculos-de-estructura/index.html`**
   - Salto de `H2` a `H4` en la sección "Análisis de Arquitectura".
3. **`casa-country/index.html`**
   - Salto de `H2` a `H4` en la sección "Eficiencia Bioclimática".
4. **`casa-ladrillo/index.html`**
   - Salto de `H2` a `H4` en "Ladrillo Visto: ¿Cómo combinarlo con materiales contemporáneos?".
5. **`casa-moderna/index.html`**
   - Salto de `H2` a `H4` en "¡Las casas pequeñas modernas más hermosas que verás hoy!".
6. **`casas-steel-framing/index.html`**
   - Salto de `H2` a `H4` en la sección "Fundación y Platea".
7. **`casas-steel-framing/steel-framing-vs-construccion-tradicional/index.html`**
   - Salto de `H2` a `H4` en la sección "Muro Multicapa Termoacústico".
8. **`casas-steel-framing/ventajas-desventajas/index.html`**
   - Salto de `H2` a `H4` en "Ventaja ByB:".
9. **`construccion-en-seco/index.html`**
   - Saltos repetidos de `H2` a `H4` en "Revestimiento Exterior (EIFS o Placas)", "Ampliación en Terrazas", y "¿Qué influye en el costo m²?".
10. **`duplex/index.html`**
    - Salto de `H2` a `H4` en la sección "+15 Proyectos".
11. **`empieza-diseno-de-tu-casa/index.html`**
    - Salto de `H2` a `H4` en "Mod. Minimalista Premium" y "Entrevista de Programa".
12. **`mejores-tipos-de-techos/index.html`**
    - Salto de `H2` a `H4` en la sección "Barrera Hidrófuga y de Vapor".
13. **`refacciones-inmobiliarias/index.html`**
    - Salto de `H2` a `H4` en "¿Cómo aumentar el valor de tu vivienda con pequeñas reformas?".
14. **`tipos-de-suelos/index.html`**
    - Salto de `H2` a `H4` en la sección "Control de Niveles y Planicidad".

**Recomendación:** En todos los casos citados, los elementos que utilizan la etiqueta `<h4>` deben cambiarse a `<h3>` en el código HTML. Para mantener el aspecto visual deseado, se debe aplicar la clase de Tailwind CSS correspondiente (por ejemplo, añadiendo clases de tamaño de fuente como `text-base` o `text-lg` en lugar de confiar en la etiqueta semántica para definir el tamaño).

---

## 4. Hallazgos de Calidad de Contenido y E-E-A-T (Experiencia, Autoridad, Confianza)

### 4.1 Consistencia NAP Local (Name, Address, Phone)
- El sitio tiene una excelente consistencia NAP. La dirección física comercial (`Crisóstomo Alvarez 1584, San Miguel de Tucumán, Tucumán, Argentina`), el teléfono corporativo (`+5403816425740`) y el correo oficial se muestran correctamente en los fallbacks `<noscript>` de todas las páginas, garantizando la resolución geográfica inequívoca por parte de Google Maps e índices locales.

### 4.2 Factualidad y Autoridad Técnica en Argentina
El algoritmo de Google (especialmente mediante las directrices de Calidad del Contenido del Buscador) prioriza y evalúa positivamente que los sitios web de sectores profesionales (como la construcción) citen y vinculen estándares técnicos oficiales y regulaciones vigentes en el país de operación.

- **Casas Steel Framing:**
  - **Falta detectada:** La subpágina de ahorro energético (`/casas-steel-framing/ahorro-energetico/`) no cita los estándares técnicos locales de perfiles de acero o aislamiento.
  - **Recomendación:** Citar de forma explícita que las estructuras y perfiles galvanizados utilizados cumplen estrictamente con las **normas IRAM-IAS U 500-205 y 500-246** (estándares de seguridad estructural y sismorresistencia en Argentina), lo cual añade una altísima señal de factualidad para el usuario y los evaluadores de calidad.
- **Cotizador e Índices de Costo:**
  - **Fortaleza:** La página `/precio-construccion-m2/` cita correctamente al **Índice CAC** (Cámara Argentina de la Construcción) para contextualizar la actualización de los precios por metro cuadrado.
  - **Recomendación extendida:** Incluir esta misma referencia o nota al pie al discutir costos aproximados de construcción en seco o refacciones en las páginas `/duplex/` y `/construccion-en-seco/` para unificar la autoridad del sitio.

---

## 5. Plan de Acción Priorizado

### Fase 1: Quick Wins y Correcciones Críticas (0-15 días)
1. **Corrección de Meta-Descriptions Largas:** Modificar el texto en `index.html` y las 7 subpáginas identificadas en la sección 3.2 para ajustarlas al rango de 120-160 caracteres.
2. **Corrección de Títulos Truncados:** Reducir las etiquetas `<title>` listadas en la sección 3.1 para evitar que Google los corte en los resultados de búsqueda.

### Fase 2: Corrección Estructural Semántica (15-30 días)
1. **Reemplazar Etiquetas H4 por H3:** Modificar en las 15 páginas identificadas los elementos que saltan jerárquicamente a `<h4>` por `<h3>`, ajustando las clases de Tailwind CSS si es necesario para conservar el tamaño visual de la tipografía original.
2. **Reemplazar H3 por H2 en Legales:** Modificar en `aviso-legal` y `politica-privacidad` las etiquetas `<h3>` del menú lateral ("SECCIONES") por `<h2>` para restaurar la lógica secuencial desde el `H1`.

### Fase 3: Fortalecimiento de E-E-A-T (Largo Plazo)
1. **Insertar Menciones Normativas IRAM:** Añadir un párrafo contextual en la landing de Steel Framing y Ahorro Energético que cite la certificación de materiales bajo normas sismorresistentes IRAM-IAS.
2. **Vinculación de Índices CAC en el Ecosistema de Servicios:** Asegurar que toda mención a precios m² en dúplex o construcción tradicional haga referencia formal al índice de variación de costos de la construcción.
