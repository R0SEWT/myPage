# Portfolio v3 — Rebuild Total (Astro) — Design Spec

- **Date:** 2026-07-05
- **Status:** Approved (design), pending implementation plan
- **Supersedes:** `2026-05-31-portfolio-redesign-design.md` (rv-7za, variante C sobre React).
  La estética de variante C sobrevive; el codebase no.
- **Reusa:** `2026-06-01-project-media-asset-map.md` (inventario de media por proyecto).

## Contexto y decisión

El usuario decidió **quema total** del sitio actual: no solo la presentación (tema
alquímico/FMA) sino también el stack React/Vite (`rosewt-arariwa/`). Motivos:

1. El sitio live entierra la señal bajo la metáfora (ya diagnosticado en rv-7za).
2. La selección de proyectos quedó desalineada con la evidencia: el inventario
   curado en `~/Code/github-map` (90 repos con scores) puntúa arriba a proyectos
   que el sitio ni menciona (potato-achis 9/10/9, dermatomicos-Bago 9/8/8), y el
   sitio muestra el catálogo antiguo.
3. Un portfolio es contenido, no interactividad: React SPA es la herramienta
   equivocada para un sitio estático de contenido curado.

Decisiones tomadas con el usuario (2026-07-05):

| Decisión | Elección |
|---|---|
| Alcance | Quema total: sitio + spec anterior + stack |
| Stack | **Astro** (recomendado por perfil: el valor es el contenido) |
| Selección de proyectos | Curada por narrativa desde github-map, veto del usuario |
| Estructura | Home densa one-pager-like + página de detalle por proyecto |
| Estética | Fría minimal (variante C) + firma andina sutil |
| Idioma | **Inglés** (cv/master.md ya está en inglés; alcance remoto) |

## Arquitectura

Nuevo directorio **`site/`** en este mismo repo (mismo flujo Netlify desde `main`).

```
site/
  src/
    content/
      projects/*.md      # content collection tipada (zod schema en config)
    data/
      profile.ts         # experiencia, educación, publicación, contacto
    layouts/             # Base layout (SEO, fonts, tokens)
    pages/
      index.astro        # home
      projects/[slug].astro
    styles/
      tokens.css         # design tokens (colores, type, spacing)
      global.css
  public/
    assets/projects/     # media curada por proyecto (del asset map)
    CV.en.pdf, CV.es.pdf
```

- **Content collection `projects`**: frontmatter `title, slug, tagline, result,
  stack[], links{}, status, media, featured, order`. El body del `.md` es el case
  study de la página de detalle.
- **CSS plano** con tokens (sin Tailwind). **Inter + JetBrains Mono** self-hosted
  vía Fontsource (no Google Fonts CDN).
- **Cero JS de cliente** salvo un script mínimo de scrollspy en la home.
- SEO/OG/JSON-LD: se portan del `index.html` actual, actualizados a inglés y a la
  nueva estructura (JSON-LD `Person` + por proyecto si aplica).

## Contenido (inglés, systems-first)

Gobernanza intacta: `cv/master.md` + `evidence/claims.md` mandan; cero métricas
inventadas; tono systems-first (qué sistema, arquitectura, restricciones reales).

### Home — 4 filas de sistemas

| Sistema | Rol en la narrativa | Evidencia |
|---|---|---|
| **ArbitrIA** (legal retrieval, restricted) | Headline RAG/retrieval | cv/master.md §ArbitrIA; sin repo público |
| **Lumi / dermatomicos-Bago** | LLM app en producción (Azure OpenAI, FastAPI, safety determinista, demo desplegada) | github-map 9/8/8; repo público + demo |
| **potato-achis** | ML riguroso: domain adaptation CV para cultivos andinos, stack moderno | github-map 9/10/9 (mejor repo) |
| **Gallstone Risk** | Sistema end-to-end con demo viva (`gallstone.rosewt.dev`) | github-map 8/9/9; asset map listo |

### Strip de research (compacto, sin páginas propias por ahora)

- **Imitator** — paper aceptado en CCIS (venue + métricas de claims.md).
- **GENO-MAP** — poster SALA 2026 (media del asset map).
- **Tesis en curso** — graph ML sobre riesgo en obras públicas; se menciona sin
  claims fuertes hasta que cierre (repo privado).

### Fuera

Jerga alquímica/FMA completa (especímenes, linaje, ley de equivalencia, cita de
Elric, códigos SYS·001, sellos), coursework, forks, repos con score bajo.

## Home (estructura, estética variante C)

1. **Hero recruiter-first**: badge "Open to Applied ML roles · Lima / remote"
   (dot verde), H1 con rol, línea mono "RAG · Document Intelligence · Data
   Pipelines", lede de 1-2 frases, CTAs (Projects · CV EN · CV ES · GitHub ·
   LinkedIn), quick-facts strip (Now / Focus / Publication / Education).
2. **Projects**: 4 filas apiladas — thumbnail izq. (~210px, placeholder elegante
   si falta) + título + tag de estado + qué hace + resultado destacado (▸ crimson)
   + stack mono + links (GitHub / demo / **case study →**). En móvil apila.
3. **Experience + Research**: dos columnas — CIP y Visma (bullets de cv/master.md)
   | Imitator + GENO-MAP + tesis; skills como tags compactos.
4. **Footer**: contacto, certificaciones/actividades/educación en fila discreta.

Tokens: fondo casi negro `#0c0c0d`, un solo acento crimson andino `~#b5303a`,
densidad tipo Linear/Vercel, contraste AA, `prefers-reduced-motion` respetado.
Firma andina sutil (color + detalle chakana discreto); se afina al final.

## Páginas de detalle (`/projects/<slug>`)

Plantilla por sistema: problema → arquitectura (imagen **narrativa** del asset
map) → decisiones de diseño y restricciones reales → evidencia (plots
**técnicos** del asset map) → stack completo y links. Dos capas de audiencia
(reclutador / técnico) según el insight del asset map. ArbitrIA: case study sin
repo, marcado Restricted, sin detalles confidenciales (validar contra claims.md).

## Cut-over y fuera de alcance

- El desarrollo ocurre en `dev`. `rosewt-arariwa/` **se borra** solo cuando el
  sitio nuevo esté verificado; en ese mismo cambio se actualiza `netlify.toml`
  (base/publish → `site/`) y CLAUDE.md/agents.md (referencias de estructura).
  Merge a `main` = deploy.
- Fuera de alcance: i18n ES/EN del sitio, blog, GIFs de demos que no existen aún
  (el asset map los lista como "por grabar"), páginas de research propias.

## Verificación

1. `npm run build` + `astro check` limpios desde `site/`.
2. Playwright headless: home + 1 página de detalle, desktop y móvil, 0 errores de
   consola.
3. Contraste AA en tokens; navegación por teclado; `prefers-reduced-motion`.
4. Contenido cotejado contra `cv/master.md` y `evidence/claims.md` (nombres,
   métricas, venues — sin invenciones).
5. Revisión visual contra el mockup variante C
   (`2026-05-31-portfolio-redesign-variant-C.png`) como referencia de estética.

## Tracking

Issue nuevo en beads (epic del rebuild) supersede a rv-7za. El plan de
implementación (writing-plans) desglosa en fases: scaffold → tokens/layout →
contenido → home → detalle → media → SEO/a11y → cut-over.
