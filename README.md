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

Los CV en PDF se generan desde LaTeX (`cv/main.en.tex`, `cv/main.es.tex`) y se
copian a `site/public/`.

## Gobernanza editorial

La narrativa profesional y el contenido son trazables:

- `cv/master.md` — fuente de verdad narrativa
- `evidence/claims.md` — trazabilidad de claims
- `agents.md` — política canónica para agentes y reglas editoriales

El despliegue es automático en Netlify a partir de `main`. CI
(`.github/workflows/ci.yml`) corre `build` + `check` en cada push y PR.
