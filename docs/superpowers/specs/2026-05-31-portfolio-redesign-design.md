# Portfolio Redesign — Design Spec

- **Issue:** rv-7za
- **Date:** 2026-05-31
- **Status:** Approved (design), pending implementation plan
- **Reference mockup:** `./2026-05-31-portfolio-redesign-variant-D.png` (variant D)
- **Throwaway mockups:** `/tmp/portfolio-mockup/` (variants A–D)

## Context

El portafolio actual (`rosewt.dev`) está construido sobre una metáfora de alquimia /
Fullmetal Alchemist que se come la señal: cita de Edward Elric, "Ley de equivalencia",
"Catálogo de especímenes", "Linaje y filiación", "Procedencia del operador", códigos
`SYS·001`, sellos alquímicos. Son 7 secciones largas (Hero → Tesis → Catálogo → Research
→ Linaje → Credentials → Skills → Footer). El contenido real —Applied ML Engineer con 3
sistemas sólidos + 1 paper aceptado en CCIS— queda enterrado bajo la temática y la jerga.

El problema no es el trabajo, es la envoltura: un reclutador o ingeniero que entra 20
segundos no encuentra rápido "qué construyó y con qué". El objetivo es un portafolio
**systems-first, escaneable y optimizado para reclutadores**, sin perder una firma propia
discreta.

El contenido factual NO cambia (lo gobierna `cv/master.md` + `evidence/claims.md` por
`agents.md`). Esto es un rediseño de **presentación**: estructura, jerarquía y estética.

## Decisiones de diseño (acordadas con el usuario)

1. **Rumbo:** señal + firma sutil. Quitar TODA la jerga FMA/alquimia.
2. **Estética:** fría / minimal tipo Linear-Vercel (variante D). Fondo casi-negro neutro
   (`#0c0c0d`), tipografía **Inter** (display/body) + **JetBrains Mono** (técnica, ya
   cargada). Reemplaza la pareja Cormorant/EB Garamond actual.
3. **Color de acento:** un único crimson anclado al tono andino real del sistema Arariwa
   (`~#b5303a`, cercano al `--accent: #8b2635` existente), no un rojo genérico.
4. **Estructura:** one-pager denso de 4 bloques.
5. **Proyectos:** **cards expandibles** en grid de 2 columnas. Compactas por defecto
   (título + tag de estado + una línea + stack); click expande a ancho completo revelando
   media (gif/screenshot), bullets de detalle y links. Escaneo rápido + profundidad opcional.
6. **Naming:** nombres reales (GENO-MAP, ArbitrIA, Gallstone Risk) + una línea de qué hace.
   Se eliminan códigos `SYS·001` y la etiqueta "especímenes".
7. **Proyectos mostrados:** los 3 sistemas (GENO-MAP, ArbitrIA, Gallstone Risk) + Imitator
   en Research. ArbitrIA se conserva: es el único ejemplo de retrieval/RAG, el headline.
8. **Navegación:** topbar sticky con "Descargar CV" destacado + scrollspy (link de sección
   activa resaltado).
9. **Firma andina:** se afina al final de la implementación (paleta/sello chakana sutil).
   Decisión diferida explícitamente por el usuario.

## Estructura de la página

### Bloque 1 — Hero (above the fold, recruiter-first)
- Badge "Open to Applied ML roles · Lima / remote" (dot verde).
- H1: "Rody Vilchez — **Applied ML Engineer.**" (Engineer en crimson).
- Rol mono: "RAG · Document Intelligence · Data Pipelines".
- Lede: 1-2 frases del summary (sin "curador de sistemas aplicados").
- CTAs: Ver proyectos · CV ES · CV EN · GitHub · LinkedIn.
- **Quick-facts strip**: Ahora / Foco / Publicación / Educación — perfil completo en <10s
  sin scroll.
- Se elimina la ficha lateral "Operator Profile" (su info útil se absorbe aquí).

### Bloque 2 — Proyectos (el corazón)
- Grid 2-col de cards expandibles.
- **Compacta:** título + tag de estado + una línea de qué hace + stack mono.
- **Expandida** (click, ancho completo): slot de media opcional + bullets de
  decisión/resultado + links (GitHub/demo/poster).
- Slot de media degrada elegante: si no hay asset, la card abierta muestra solo bullets.
- Interacción accesible: teclable, `aria-expanded`, respeta `prefers-reduced-motion`.

### Bloque 3 — Experiencia + Research (dos columnas, compacto)
- Izq: CIP + Visma con bullets actuales (ya systems-first).
- Der: Imitator (venue + 3 métricas grandes) + skills como tags compactos integrados.

### Bloque 4 — Footer / contacto
- Email + links de contacto.
- Certificaciones (`CERTIFICATIONS`) + actividades (`ACTIVITIES`) + educación
  (`EDUCATION`) en una fila/grid discreta, sin sección propia destacada.

## Componentes afectados

Source: `rosewt-arariwa/src/`.

| Componente | Cambio |
|---|---|
| `App.tsx` | Reordenar a 4 bloques; eliminar secciones Tesis y Linaje y sus divisores/sigilos. |
| `components/Header.tsx` | Nuevo NAV (Proyectos/Experiencia/Research/Contacto + Descargar CV); quitar "Catálogo de sistemas aplicados"; añadir scrollspy. |
| `components/Hero.tsx` | Reescribir: badge, H1, rol, lede, CTAs, quick-facts. Quitar ficha "Operator Profile" y sigilos FMA. |
| `components/SpecimenCard.tsx` | Convertir en card expandible (estado `open`, `aria-expanded`, slot media, bullets). Renombrar conceptualmente a ProjectCard. Quitar los SVG `SIGILS` y campos `code`/"especímenes". |
| `components/ResearchItem.tsx` | Compactar (no full-bleed). |
| `components/Skills.tsx`, `Credentials.tsx` | Integrar inline en bloque 3/footer; evaluar si sobreviven como componentes propios. |
| `data/constants.ts` | `Specimen`: quitar/relegar `code`; añadir `media?: string` (opcional) y `details?: string[]` para el cuerpo expandido. Renombrar tipo a `Project` (alias retrocompatible si simplifica). Reusar `RESEARCH`, `EXPERIENCE`, `SKILLS`, etc. sin tocar datos. |
| `styles/arariwa.css` | Añadir variante de tokens "fría" (o nuevo `[data-variant]`); conservar crimson andino. |
| `styles/layout.css` | Estilos de cards expandibles, hero, quick-facts, grid. Retirar CSS de Tesis/Linaje/catálogo/sigilos. |
| `index.html` | Cambiar fuentes Google (Inter + JetBrains Mono); quitar Cormorant/EB Garamond. Conservar SEO/JSON-LD intactos. |
| `hooks/useReveal.ts` | Se conserva (reveal on scroll). Añadir hook/lógica de scrollspy o integrarlo. |

## Restricciones

- **No tocar** `cv/master.md` ni `evidence/claims.md`. Contenido factual intacto; solo
  presentación. (`agents.md` Source of Truth.)
- Mantener accesibilidad: contraste AA, navegación por teclado, `aria-expanded` en cards,
  `prefers-reduced-motion`.
- Mantener SEO: meta tags, OG, JSON-LD de `index.html` no se degradan.
- Deploy: cambios a `dev`; producción despliega desde `main` (no forzar deploy).

## Verificación

1. `cd rosewt-arariwa && npm run lint && npm run build` pasan sin errores.
2. Playwright (headless) sobre `npm run dev`: screenshot del hero + cards (compacta y
   expandida) — render correcto, 0 errores de consola.
3. Revisión visual contra el mockup de referencia (variant D).
4. Verificar en viewport móvil (cards apilan, nav colapsa).
5. Confirmar que el contenido factual coincide con `cv/master.md` (nombres, métricas,
   venues) — sin invenciones.

## Fuera de alcance (follow-ups)

- Assets de media reales (gifs/screenshots por proyecto) — slots quedan con placeholder.
- Afinado final de la firma andina (sello chakana sutil).
- i18n ES/EN del contenido del sitio.
