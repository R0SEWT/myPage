# Portafolio Personal – Rody Vilchez

Sitio personal y CV de Rody Vilchez (**Applied ML Engineer**), enfocado en
sistemas de IA aplicada: retrieval (RAG), document intelligence y data pipelines.
Desplegado en **Netlify** sobre el dominio [`rosewt.dev`](https://rosewt.dev).

El código de la aplicación vive en [`site/`](./site).

## Stack Técnico

- **Framework**: [Astro 5](https://astro.build) (sitio estático multi-página)
- **Lenguaje**: TypeScript
- **Styling**: CSS propio con el sistema de diseño **Arariwa**
  (`src/styles/tokens.css` tokens, `src/styles/global.css` layout) — sin Tailwind
- **Contenido**: `src/data/profile.ts` + content collection en `src/content/projects/` (Markdown)
- **SEO**: Open Graph + Twitter Cards + JSON-LD (Person, SoftwareSourceCode)
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

El despliegue es automático en Netlify a partir de `main`. CI
(`.github/workflows/ci.yml`) corre `build` + `check` en cada push y PR.
