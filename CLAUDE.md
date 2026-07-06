# CLAUDE.md

This file provides technical orientation for Claude Code when working in this repository.
Canonical repo policy, editorial rules, and evidence handling live in `agents.md`.

## Canonical Pointers

- `agents.md` wins if there is any conflict.
- Use `cv/master.md` for narrative content and `evidence/claims.md` for factual traceability.
- Do not inspect `.cv-vault/` unless the user explicitly asks for private evidence.
- Use `docs/adr/` for accepted durable decisions and `docs/plans/` for active multi-step work.
- Use **`bd` (beads)** for issue/task tracking and persistent knowledge — see "Beads Issue Tracker" below.

These layers are complementary, not competing: `bd` tracks granular issues and ongoing work; `docs/plans/` holds decision-complete initiative plans; `docs/adr/` records durable decisions.

## Project Structure

All source code lives under `site/`. Commands must be run from that directory.
Prior React/Vite and Astro-prototype implementations have been fully removed — do not reference their old paths.
Design system assets and UI kit reference files live in `docs/design/`.

```
site/
  src/
    components/       # Astro components: Header, Hero, Footer, ProjectRow, sections
    content/
      projects/       # Project detail content (Markdown, content collection)
    content.config.ts # Content collection schema
    data/
      profile.ts      # Site data: experience, publications, contact, etc.
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      projects/[slug].astro
      404.astro
    styles/
      tokens.css      # Design tokens (colors, type, spacing)
      global.css      # Layout and component styles
  public/
    assets/projects/  # Project media assets
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

All commands from `site/`:

```bash
npm run dev        # Start dev server (Astro)
npm run build      # Production build (static output to dist/)
npm run preview    # Preview production build
npm run check      # Astro/TypeScript diagnostics (no separate lint script)
```

## Architecture

**Astro (static output)**: Multi-page site built with Astro and TypeScript. No client-side framework runtime; islands are plain `<script>` tags where needed (e.g. scroll-spy nav).

**Content collections**: Project case studies live as Markdown files in `src/content/projects/`, validated against the schema in `src/content.config.ts`. Other site data (experience, publications, contact info, tech stack) is exported from `src/data/profile.ts`. Components consume these rather than hardcoding strings.

**Styling**: Plain CSS using the Arariwa design system (`tokens.css` for design tokens, `global.css` for layout/components). No Tailwind, no CSS-in-JS.

**Design system**: `docs/design/` contains the full Arariwa brand reference — colors, typography, spacing, component previews, and a portfolio UI kit. Use these as the canonical visual reference when building or modifying UI.

**Deployment**: Netlify, from the `main` branch (production). Pushing to `dev` does not deploy. A single root `netlify.toml` carries security headers, asset cache, and `NODE_VERSION=20`. Domain: `rosewt.dev`. See `docs/adr/ADR-0005-deploy-canonical-and-mcp-tooling.md`.

**MCP tooling**: `.mcp.json` (project-level) declares two servers — **Playwright** (`--headless --isolated`, required so the browser never opens a window that clashes with Wayland/Hyprland) for visual checks, and **Context7** for up-to-date library docs. Editing `.mcp.json` requires restarting Claude Code to reconnect.

## Editorial Governance

- `cv/master.md` is the narrative source of truth.
- `evidence/claims.md` is the claim traceability layer.
- Public surfaces must not contradict either file.
- See `agents.md` for the full policy and update protocol.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands. Issue prefix is `rv-`; backend is Dolt (embedded).

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - from `site/`: `npm run build && npm run check`
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
