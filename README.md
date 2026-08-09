# Portafolio Personal – Rody Vilchez

[![Netlify Status](https://api.netlify.com/api/v1/badges/8a756732-967b-4fbd-b4f4-c37d446bdf6a/deploy-status)](https://app.netlify.com/projects/rosewt/deploys)

Sitio personal y CV de Rody Vilchez (**Applied ML Engineer**), enfocado en
sistemas de IA aplicada: retrieval (RAG), document intelligence y data pipelines.
Desplegado en **Netlify** sobre el dominio [`rosewt.dev`](https://rosewt.dev).

El código de la aplicación vive en [`site/`](./site).

## Cómo está armado

El sitio son dos cosas distintas bajo el mismo build.

**La portada es un deck**, no una página que se scrollea. Siete pantallas
(`src/components/deck/screens/`) que comparten una celda de grid y se cruzan con
un fundido; detrás corre un campo de partículas en WebGL crudo — sin three.js —
y una estela de puntero sobre canvas 2D. Todo el copy está en `src/data/deck.ts`.

**Las cuatro fichas de proyecto** (`/projects/*`) son documentos normales, con su
propio layout y su propio sistema visual.

El **bilingüe** no re-renderiza: las dos versiones de cada string van al DOM y
una regla de CSS sobre `data-lang` en `<html>` decide cuál se ve, así que cambiar
de idioma cuesta escribir un atributo. Lo que CSS no puede conmutar — `alt`,
`aria-label` — lo escribe `src/scripts/deck.ts` leyendo `data-i18n`.

## Stack Técnico

- **Framework**: [Astro 5](https://astro.build) (`output: 'static'`), sin runtime
  de framework en el cliente — solo los scripts del deck
- **Lenguaje**: TypeScript
- **Styling**: CSS propio, sin Tailwind, en **dos sistemas** que conviven:
  - **Vesper** (`src/styles/vesper.css`) — el deck. Se dibuja a un root de 125%
  - **Arariwa** (`src/styles/tokens.css` + `global.css`) — fichas de proyecto y 404
- **Contenido**: `src/data/deck.ts` (deck, bilingüe), `src/data/profile.ts`
  (fichas) y la content collection en `src/content/projects/` (Markdown)
- **SEO**: Open Graph + Twitter Cards + JSON-LD (`ProfilePage`/`Person` en la
  portada, `SoftwareSourceCode` en las fichas), sitemap vía `@astrojs/sitemap`,
  `robots.txt` y `site.webmanifest`
- **Deployment**: [Netlify](https://www.netlify.com/) (config en `netlify.toml` raíz)

## Desarrollo Local

Todos los comandos desde `site/`:

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo (Astro)
npm run build    # Build de producción (salida estática a dist/)
npm run preview  # Previsualizar el build
npm run check    # Diagnóstico de Astro/TypeScript (no hay script de lint separado)
```

## CV (PDF)

Los CV se escriben en LaTeX dentro del bundle vigente en `cv/`
(`Rody_Vilchez_CV_v<N>_bundle/`), en dos ediciones que son pares entre sí. Los
PDF compilados no se versionan: se copian a mano a `site/public/CV.es.pdf` y
`CV.en.pdf`. Ver ADR-0007.

## Gobernanza editorial

La narrativa profesional y el contenido son trazables:

- `cv/Rody_Vilchez_CV_v<N>_bundle/` — fuente de verdad narrativa (ES y EN, pares)
- `evidence/claims.md` — trazabilidad de claims, y árbitro si las dos ediciones difieren
- `agents.md` — política canónica para agentes y reglas editoriales

Las decisiones durables viven en `docs/adr/`; el trabajo multi-paso en curso, en
`docs/plans/`. El seguimiento de tareas es con **beads** (`bd`), prefijo `rv-`.

El despliegue es automático en Netlify a partir de `main` — empujar a `dev` no
despliega. CI (`.github/workflows/ci.yml`) corre `build` + `check` en cada push y PR.
