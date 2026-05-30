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

## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands. Issue prefix is `rv-` (e.g. `rv-1`).

### Quick Reference

```bash
bd ready                # Find available work (no blockers)
bd create "title" -t task   # Create an issue (types: task, bug, feature, epic, chore)
bd show <id>            # View issue details
bd update <id> --claim  # Claim work (sets in_progress)
bd close <id>           # Complete work
bd dep add <blocker> <blocked>  # Add a dependency
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists.
- Use `bd remember "…"` for persistent project knowledge (gotchas, conventions, decisions) — do NOT use MEMORY.md files.
- `.beads/issues.jsonl` is the git-tracked source of truth; `.beads/*.db` is local and gitignored (rebuilt from JSONL).
- This build uses the plain JSONL backend — there is no `bd dolt`. Sync is ordinary git.

## Session Completion

When ending a work session, complete these steps. Work is NOT complete until `git push` succeeds.

1. **File issues for remaining work** — `bd create` for anything needing follow-up.
2. **Run quality gates** (if code changed) — from `rosewt-arariwa/`: `npm run lint && npm run build`.
3. **Update issue status** — close finished work, update in-progress items.
4. **Commit + push** (MANDATORY):
   ```bash
   git add .beads/issues.jsonl   # plus your other changes
   git pull --rebase
   git push
   git status                    # MUST show "up to date with origin"
   ```
5. **Verify** — all changes committed AND pushed.

CRITICAL: never stop before pushing — that strands work locally. If push fails, resolve and retry until it succeeds.


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

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
2. **Run quality gates** (if code changed) - Tests, linters, builds
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
