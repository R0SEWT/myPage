# CLAUDE.md

This file provides technical orientation for Claude Code when working in this repository.
Canonical repo policy, editorial rules, and evidence handling live in `agents.md`.

## Canonical Pointers

- `agents.md` wins if there is any conflict.
- Use `cv/master.md` for narrative content and `evidence/claims.md` for factual traceability.
- Do not inspect `.cv-vault/` unless the user explicitly asks for private evidence.
- Use `docs/adr/` for accepted durable decisions and `docs/plans/` for active multi-step work.

## Project Structure

All source code lives under `rosewt-arariwa/`. Commands must be run from that directory.
`rosewt-astro/` is deprecated and deleted — do not reference it.
Design system assets and UI kit reference files live in `docs/design/`.

```
rosewt-arariwa/
  src/
    components/       # React components: Header, Hero, Footer, sections, atoms
    data/
      constants.ts    # All site data: experience, publications, contact, etc.
    styles/
      arariwa.css     # Design tokens (colors, type, spacing)
      layout.css      # Layout and component styles
  public/
    assets/           # SVG brand assets (wordmark, seals, patterns)
    CV.en.pdf
    CV.es.pdf

docs/design/          # Arariwa design system reference (not deployed)
  project/
    assets/           # Brand SVGs
    colors_and_type.css
    preview/          # HTML previews of design tokens and components
    ui_kits/portfolio/  # Reference UI kit
```

## Commands

All commands from `rosewt-arariwa/`:

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build (tsc + vite build)
npm run preview    # Preview production build
npm run lint       # ESLint
```

## Architecture

**React + Vite**: SPA built with React and TypeScript. Vite handles bundling and dev server.

**Site data in one place**: All text content (experience, publications, contact info, tech stack) is exported from `src/data/constants.ts`. Components consume these constants rather than hardcoding strings.

**Styling**: Custom CSS using the Arariwa design system (`arariwa.css` for tokens, `layout.css` for structure). No Tailwind.

**Design system**: `docs/design/` contains the full Arariwa brand reference — colors, typography, spacing, component previews, and a portfolio UI kit. Use these as the canonical visual reference when building or modifying UI.

**Deployment**: Netlify. Config in `netlify.toml`. Domain: `rosewt.dev`.

## Editorial Governance

- `cv/master.md` is the narrative source of truth.
- `evidence/claims.md` is the claim traceability layer.
- Public surfaces must not contradict either file.
- See `agents.md` for the full policy and update protocol.
