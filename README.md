# Portafolio Personal – Rody Vilchez

Sitio personal y CV de Rody Vilchez (**Applied ML Engineer**), enfocado en
sistemas de IA aplicada: retrieval (RAG), document intelligence y data pipelines.
Desplegado en **Netlify** sobre el dominio [`rosewt.dev`](https://rosewt.dev).

El código de la aplicación vive en [`rosewt-arariwa/`](./rosewt-arariwa).

## Stack Técnico

- **Framework**: [React 19](https://react.dev) (SPA)
- **Build**: [Vite 8](https://vite.dev)
- **Lenguaje**: TypeScript
- **Styling**: CSS propio con el sistema de diseño **Arariwa**
  (`src/styles/arariwa.css` tokens, `src/styles/layout.css` layout) — sin Tailwind
- **Contenido**: centralizado en `src/data/constants.ts`
- **SEO**: Open Graph + Twitter Cards + JSON-LD (Person, SoftwareSourceCode, ScholarlyArticle)
- **Deployment**: [Netlify](https://www.netlify.com/) (config en `netlify.toml` raíz)

## Desarrollo Local

Todos los comandos desde `rosewt-arariwa/`:

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo (Vite)
npm run build    # Build de producción (tsc -b && vite build)
npm run preview  # Previsualizar el build
npm run lint     # ESLint
```

## CV (PDF)

Los CV en PDF se generan desde LaTeX (`cv/main.en.tex`, `cv/main.es.tex`) y se
copian a `rosewt-arariwa/public/`:

```bash
rosewt-arariwa/scripts/build-cv.sh   # requiere pdflatex o tectonic
```

## Gobernanza editorial

La narrativa profesional y el contenido son trazables:

- `cv/master.md` — fuente de verdad narrativa
- `evidence/claims.md` — trazabilidad de claims
- `agents.md` — política canónica para agentes y reglas editoriales

El despliegue es automático en Netlify a partir de `main`. CI
(`.github/workflows/ci.yml`) corre `lint` + `build` en cada push y PR.
