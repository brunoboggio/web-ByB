# Plantilla de Referencia: robots.txt optimizado para GEO

> Este archivo controla qué bots pueden rastrear el sitio.
> Para GEO/AEO, es CRÍTICO no bloquear los crawlers de IA.

## Plantilla Recomendada

```
# ============================================
# robots.txt — Optimizado para GEO/AEO
# Dominio: [tudominio.com]
# Última actualización: [YYYY-MM-DD]
# ============================================

# --- Crawler principal de Google ---
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /tmp/

# --- Google AI / Gemini / AI Overviews ---
User-agent: Google-Extended
Allow: /

# --- Perplexity AI ---
User-agent: PerplexityBot
Allow: /

# --- OpenAI / ChatGPT ---
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# --- Anthropic / Claude ---
User-agent: ClaudeBot
Allow: /

# --- Meta AI ---
User-agent: FacebookBot
Allow: /

# --- Amazon / Alexa AI ---
User-agent: Amazonbot
Allow: /

# --- ByteDance / TikTok AI ---
User-agent: Bytespider
Allow: /

# --- Microsoft / Bing / Copilot ---
User-agent: Bingbot
Allow: /

# --- Apple / Applebot ---
User-agent: Applebot
Allow: /

# --- Regla general para otros bots ---
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /tmp/
Disallow: /*.json$
Disallow: /node_modules/

# --- Sitemap ---
Sitemap: https://[tudominio.com]/sitemap.xml

# --- Archivos LLM ---
# Referencia: https://llmstxt.org/
# llms.txt: https://[tudominio.com]/llms.txt
# llms-full.txt: https://[tudominio.com]/llms-full.txt
```

## Bots de IA — Referencia Completa

| Bot | Empresa | Motor Generativo | Importancia GEO |
|-----|---------|-------------------|-----------------|
| `Google-Extended` | Google | Gemini, AI Overviews | ⭐⭐⭐⭐⭐ |
| `PerplexityBot` | Perplexity | Perplexity Search | ⭐⭐⭐⭐⭐ |
| `OAI-SearchBot` | OpenAI | ChatGPT Search | ⭐⭐⭐⭐⭐ |
| `ChatGPT-User` | OpenAI | ChatGPT Browsing | ⭐⭐⭐⭐ |
| `ClaudeBot` | Anthropic | Claude | ⭐⭐⭐⭐ |
| `Bingbot` | Microsoft | Copilot | ⭐⭐⭐⭐ |
| `Applebot` | Apple | Apple Intelligence | ⭐⭐⭐ |
| `FacebookBot` | Meta | Meta AI | ⭐⭐⭐ |
| `Amazonbot` | Amazon | Alexa AI | ⭐⭐⭐ |
| `Bytespider` | ByteDance | TikTok AI | ⭐⭐ |

## ⚠️ Errores Comunes a Evitar

1. **Bloquear `Google-Extended`** → Invisible para Gemini y AI Overviews
2. **Bloquear todos con `User-agent: *` + `Disallow: /`** → Sitio completamente invisible para IAs
3. **No incluir `Sitemap:`** → Dificulta el descubrimiento de URLs
4. **Bloquear archivos CSS/JS** → Los bots no pueden renderizar la página correctamente
