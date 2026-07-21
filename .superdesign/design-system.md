# Rody Vilchez Portfolio — Design System Context

## Product and audience

This is a static English-language portfolio for Rody Vilchez, an Applied ML Engineer. It must serve three audiences in one scan: non-technical recruiters, ML/engineering managers, and researchers. The homepage should communicate within 8–10 seconds: current enterprise agent/document work at CIP · CGIAR, published research, credible upstream engineering evidence, and Infelix as the flagship research program.

## Evidence contract

- Never invent metrics, dates, employers, statuses, publication identifiers, or outcomes.
- Treat the user's current task brief as the newest source for hierarchy and status.
- Imitator may be labeled `Published · Springer CCIS 2895 · DOI`, but do not fabricate the DOI value.
- Upstream evidence may name Microsoft Copilot Studio, HDBSCAN, beads / bd, and Gemini CLI, but do not fabricate PR numbers, acceptance status, dates, or impact.
- Infelix subtitle: `Learning under Imperfect Observation`.
- Infelix topics: reporting bias, geocoding degradation, cross-city transfer, and evaluability.
- Secondary systems are Wachi, Gallstone, Lumi, and Potato-ACHIS. Do not present them as peers of CIP, Infelix, Imitator, or the upstream evidence.

## Current implemented visual system — ground truth only

The current UI uses a nearly black archival surface, warm text, crimson/orange accents, Inter Variable, JetBrains Mono Variable, Georgia display headings, 76rem content width, strong horizontal rules, asymmetric project rows, and subtle Andean seals/patterns. Exact tokens and responsive rules are in `site/src/styles/tokens.css` and `site/src/styles/global.css`. The reproduction draft must follow those files exactly.

## GhostCursor exploration — mandatory constraints

The design exploration adapts the supplied GhostCursor reference: a pointer-following smoky trail rendered by a transparent Three.js shader plane, with inertia, bloom, grain, `screen` blending, and an idle fade. This is a motion-layer exploration, not permission to redesign the portfolio.

- Preserve the current homepage content, order, typography, spacing rhythm, dark surfaces, borders, and navigation. GhostCursor is the only new visual system.
- Do not use the reference demo's purple/blue palette. The trail may use only existing tokens: `--accent-soft` (`#d68b45`), `--accent-muted` (`#7f4730`), `--text-dim` (`#a99b85`), or a neutral derived from them.
- The effect must remain behind readable content, use `pointer-events: none`, and never obscure text, links, project evidence, or focus rings.
- Explore exactly three placements: hero-local ambient layer; effect contained inside the profile dossier; restrained viewport overlay. Each branch changes only placement/intensity, not the information architecture.
- Hero-local branch is the primary hypothesis: one effect constrained to the first fold, with content above it and a clean cutoff before Selected systems.
- Dossier branch replaces only the card's decorative seal/pattern layer; quick facts stay fully readable above the shader.
- Viewport-overlay branch must be sparse and short-lived: lower brightness, shorter trail, low bloom, and immediate fade so the page never feels like a game or particle demo.
- Do not add a "Ghost Cursor" title, instructions such as "move your cursor", replay controls, decorative gradients, new cards, or marketing copy from the reference demo.
- Desktop preview should show the trail in a representative mid-motion state. Mobile should show the no-WebGL/static fallback; touch devices must not depend on cursor interaction.
- Later implementation must disable the effect for `prefers-reduced-motion`, provide a static/no-effect fallback, cap device pixel ratio/pixel budget, stop RAF after fade-out, and avoid initializing more than one WebGL renderer.
- Avoid giant atmospheric blobs behind the H1. The motion should reward interaction after comprehension, not compete with the 8–10 second reading path.

## Content hierarchy

1. Current professional work: CIP · CGIAR — Enterprise agents and multilingual document workflows.
2. External evidence: Imitator published in Springer CCIS 2895 with DOI; upstream engineering across Microsoft Copilot Studio, HDBSCAN, beads / bd, and Gemini CLI.
3. Flagship research: Infelix — Learning under Imperfect Observation.
4. Published research: Imitator — Multimodal Sign Language Model.
5. Secondary systems: Wachi, Gallstone, Lumi, Potato-ACHIS.

## Layout and responsiveness

- Desktop preview target: approximately 1180–1280px content width.
- Mobile preview target: approximately 360–390px, with a static/no-effect fallback.
- Maintain a clear linear reading order on mobile; no horizontal scrolling.
- The top viewport must establish name, role, CIP/current-work grounding, publication signal, upstream signal, and Infelix flagship status.
- Project hierarchy must be visibly asymmetric: featured sections, evidence strips, or ledgers are acceptable; equal cards are not.

## Accessibility baseline

- Preserve semantic heading order and obvious focus/interaction affordances.
- Body text and annotations must remain legible at wireframe scale.
- Do not rely on color to communicate attention or state.
