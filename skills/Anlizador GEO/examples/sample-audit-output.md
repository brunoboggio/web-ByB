# Ejemplo de Auditoría GEO/AEO — Referencia

> Este archivo muestra la estructura esperada del documento de salida.

---

# Auditoría GEO y AEO Técnica: Constructora ByB

## 1. Resumen Ejecutivo (Visibilidad en la Era Zero-Click)

El sitio constructorabyb.com.ar presenta una arquitectura HTML estática favorable
para el rastreo de LLMs, pero carece de señales de entidad estructuradas (Schema.org),
archivos de ingesta para IA (llms.txt) y bloques de respuesta directa optimizados
para RAG. La ausencia de FAQPage Schema y la falta de Answer Blocks de 40-60 palabras
reduce significativamente la probabilidad de citación en Perplexity y AI Overviews.

**Riesgo principal:** Sin Schema de Organization con `sameAs`, la marca no tiene
identidad verificable en el Knowledge Graph de ningún motor generativo.

**Oportunidad:** Al ser HTML estático, el sitio ya es crawler-friendly. Implementar
las recomendaciones MACRO + MICRO posicionaría al sitio como fuente citable en
consultas como "constructora en Buenos Aires" o "precio construcción m2 Argentina".

---

## 2. Auditoría Nivel MACRO

### 2.1 Archivos LLM y Rastreo

**Problema:** No existe `/llms.txt` ni `/robots.txt` con directivas para bots de IA.
**Impacto GEO:** Los motores generativos no tienen un resumen estructurado de la entidad.
**Solución:** Crear ambos archivos. Ver templates en `resources/templates/`.

### 2.2 Schema de Entidad Global

**Problema:** No existe Schema JSON-LD de Organization.
**Impacto GEO:** La marca es una "entidad sin resolver" para los LLMs.
**Solución:** Implementar Organization + WebSite Schema.

### 2.3 Arquitectura de URLs

**Diagnóstico:** URLs correctas — semánticas, en minúsculas, con guiones medios.
✅ `/casa-moderna/`, `/duplex/`, `/contacto/`

---

## 3. Auditoría Nivel MICRO

### 3.1 Jerarquía de Encabezados

**Diagnóstico:** Múltiples H1 o H1 genéricos encontrados en algunas páginas.
**Propuesta:** Un solo H1 descriptivo por página.

### 3.2 Answer Blocks

**Antes (no optimizado):**
> "Somos una empresa de construcción con muchos años de experiencia en el rubro
> que ofrece servicios de primera calidad para todos nuestros clientes."

**Después (optimizado, 52 palabras):**
> "Constructora ByB construye casas modernas, dúplex y viviendas steel framing
> en Buenos Aires desde 2015. Nuestros proyectos llave en mano incluyen diseño
> arquitectónico, trámites municipales y construcción completa con garantía de
> 10 años. El precio por metro cuadrado parte desde USD 750 en mayo 2026."

---

## 4. Roadmap de Ejecución

### Fase 1: Quick Wins (0-30 días)
- Crear `robots.txt` con directivas para bots de IA
- Crear `llms.txt` con información de la entidad
- Implementar Schema Organization global

### Fase 2: Optimización (30-60 días)
- Reescribir introducciones como Answer Blocks
- Implementar FAQPage Schema en páginas de servicio
- Optimizar atributos `alt` de imágenes

### Fase 3: Autoridad (Largo Plazo)
- Crear entrada en Wikidata
- Consolidar perfiles sociales verificados
- Estrategia de menciones en directorios autoritativos
