# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Source of truth**: `cv/master.md` is the canonical content source. All professional narrative, project descriptions, and experience content originates there.

**Content flow**: `cv/master.md` → `cv/main.tex` (PDF) + website (`constants.ts`, MDX files). Never edit downstream surfaces without updating `master.md` first.

**Positioning**: Applied ML Engineer — RAG Systems, Document Intelligence, Data Pipelines. See `agents.md` for full editorial guidelines.

**Rules for content changes**:
- Do not invent metrics, claims, or experience not present in `master.md`
- Do not use weak framing: "enthusiast", "student portfolio", "used X", "learned Y"
- Describe projects by: problem → architecture → decisions → constraints → impact
- Adapt descriptions per surface (concise for CV, expanded for web) but never contradict
- Prioritize systems thinking over toy-project framing

**Rules for code changes**:
- Propose content changes by referencing `master.md` as the source
- Maintain alignment between narrative and code/content
- Favor architecture, tradeoffs, and systems thinking in all descriptions
