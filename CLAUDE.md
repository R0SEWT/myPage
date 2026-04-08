# CLAUDE.md

This file provides technical orientation for Claude Code when working in this repository.
Canonical repo policy, editorial rules, and evidence handling live in `agents.md`.

## Canonical Pointers

- `agents.md` wins if there is any conflict.
- Use `cv/master.md` for narrative content and `evidence/claims.md` for factual traceability.
- Do not inspect `.cv-vault/` unless the user explicitly asks for private evidence.

## Project Structure

All source code lives under `rosewt-astro/`. Commands must be run from that directory.

```
rosewt-astro/
  src/
    components/
      layout/     # Header, Footer, BaseHead, ThemeToggle (React), MobileMenu (React)
      sections/   # Page sections: Hero, Projects, Experience, Publications, Contact
      ui/         # Reusable: Badge, ProjectCard, ScrollReveal, SkipLinks
    content/
      projects/   # MDX files — one per project, validated by content/config.ts
    layouts/      # BaseLayout.astro wraps all pages
    lib/
      constants.ts  # All site data: SITE_CONFIG, EXPERIENCE, PUBLICATIONS, etc.
    pages/        # index.astro, 404.astro, gracias.astro
    styles/       # globals.css + components/*.css (animations, cyber-effects, etc.)
  public/         # Static assets: CV.pdf, favicon, images
```

## Commands

All commands from `rosewt-astro/`:

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run check      # Astro type-check (runs astro check)
npm run lint       # ESLint
npm run format     # Prettier --write
```

CI runs `lint → check → build` on every push/PR.

## Architecture

**Astro + selective hydration**: The site is fully static (`output: 'static'`). Most components are `.astro` (zero JS). Interactive components (`ThemeToggle`, `MobileMenu`) are React with `client:load` or equivalent directives.

**Content layer**: Projects are MDX files in `src/content/projects/`. Their schema is defined in `src/content/config.ts` with Zod. Add a new project by dropping an `.mdx` file there — `ProjectsSection.astro` queries them via `getCollection('projects')`.

**Site data in one place**: All text content (experience, publications, navigation, contact info, tech stack) is exported from `src/lib/constants.ts`. Sections consume these constants rather than hardcoding strings.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin, not PostCSS). Global base styles in `src/styles/globals.css`, which imports modular CSS files from `src/styles/components/`. Dark/light theme is managed via a `ThemeScript.astro` injected in `<head>` to prevent flash.

**Deployment**: Netlify. Config in `netlify.toml`. Domain: `rosewt.dev`.

## Editorial Governance

- `cv/master.md` is the narrative source of truth.
- `evidence/claims.md` is the claim traceability layer.
- Public surfaces must not contradict either file.
- See `agents.md` for the full policy and update protocol.
