# Plantillas de Schema JSON-LD para GEO/AEO

> Plantillas listas para implementar. Reemplaza los valores entre `[corchetes]`.

---

## 1. Organization (Entidad Global)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://[tudominio.com]/#organization",
  "name": "[Nombre de la Empresa]",
  "alternateName": "[Nombre alternativo o sigla]",
  "url": "https://[tudominio.com]",
  "logo": {
    "@type": "ImageObject",
    "url": "https://[tudominio.com]/assets/logo.png",
    "width": 512,
    "height": 512
  },
  "image": "https://[tudominio.com]/assets/og-image.jpg",
  "description": "[Descripción concisa de la empresa, 150-200 caracteres]",
  "foundingDate": "[YYYY]",
  "founder": {
    "@type": "Person",
    "name": "[Nombre del Fundador]"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección]",
    "addressLocality": "[Ciudad]",
    "addressRegion": "[Provincia]",
    "postalCode": "[Código Postal]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Latitud]",
    "longitude": "[Longitud]"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "[Ciudad 1]"
    },
    {
      "@type": "State",
      "name": "[Provincia]"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+54-[número]",
    "contactType": "customer service",
    "availableLanguage": ["Spanish"]
  },
  "sameAs": [
    "https://www.facebook.com/[perfil]",
    "https://www.instagram.com/[perfil]",
    "https://www.linkedin.com/company/[perfil]",
    "https://twitter.com/[perfil]",
    "https://www.wikidata.org/wiki/[QID]"
  ]
}
```

---

## 2. WebSite (con SearchAction para Sitelinks Search Box)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://[tudominio.com]/#website",
  "name": "[Nombre del Sitio]",
  "url": "https://[tudominio.com]",
  "publisher": {
    "@id": "https://[tudominio.com]/#organization"
  },
  "inLanguage": "es-AR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://[tudominio.com]/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 3. LocalBusiness (Para negocios con ubicación física)

```json
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://[tudominio.com]/#localbusiness",
  "name": "[Nombre de la Empresa]",
  "url": "https://[tudominio.com]",
  "image": "https://[tudominio.com]/assets/og-image.jpg",
  "telephone": "+54-[número]",
  "priceRange": "$$-$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Dirección]",
    "addressLocality": "[Ciudad]",
    "addressRegion": "[Provincia]",
    "postalCode": "[CP]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Latitud]",
    "longitude": "[Longitud]"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "[Latitud]",
      "longitude": "[Longitud]"
    },
    "geoRadius": "50000"
  },
  "sameAs": [
    "https://www.facebook.com/[perfil]",
    "https://www.instagram.com/[perfil]"
  ]
}
```

---

## 4. FAQPage (Crucial para AEO)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Pregunta 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Respuesta directa, 40-80 palabras, factual y concisa]"
      }
    },
    {
      "@type": "Question",
      "name": "[Pregunta 2]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Respuesta directa, 40-80 palabras, factual y concisa]"
      }
    }
  ]
}
```

---

## 5. Service (Para páginas de servicios)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://[tudominio.com]/[servicio]/#service",
  "name": "[Nombre del Servicio]",
  "description": "[Descripción del servicio, 150-200 caracteres]",
  "provider": {
    "@id": "https://[tudominio.com]/#organization"
  },
  "serviceType": "[Tipo de servicio]",
  "areaServed": {
    "@type": "State",
    "name": "[Provincia]"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "[Nombre del catálogo]",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "[Sub-servicio 1]"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "[Sub-servicio 2]"
        }
      }
    ]
  }
}
```

---

## 6. HowTo (Para guías paso a paso)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "[Título de la guía]",
  "description": "[Descripción de la guía]",
  "totalTime": "PT[X]M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "ARS",
    "value": "[monto]"
  },
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "[Título del paso]",
      "text": "[Descripción del paso]",
      "image": "https://[tudominio.com]/assets/paso-1.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "[Título del paso]",
      "text": "[Descripción del paso]"
    }
  ]
}
```

---

## 7. BreadcrumbList (Navegación estructurada)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://[tudominio.com]/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Categoría]",
      "item": "https://[tudominio.com]/[categoria]/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Página Actual]",
      "item": "https://[tudominio.com]/[categoria]/[pagina]/"
    }
  ]
}
```
