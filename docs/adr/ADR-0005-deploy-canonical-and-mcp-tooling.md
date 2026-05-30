# ADR-0005: Canonical Deploy on Netlify and Project MCP Tooling

- Status: Accepted
- Date: 2026-05-30

## Context

An audit before adding tooling surfaced two durable issues worth fixing once.

1. Two conflicting `netlify.toml` files existed. The root `./netlify.toml` defined
   `base`, `NODE_VERSION=20`, and the SPA redirect, but no security headers or
   cache. `./rosewt-arariwa/netlify.toml` carried the security headers
   (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and
   `Cache-Control`, but no `NODE_VERSION`. Netlify resolves the repo-root file, so
   the headers and immutable cache were effectively ignored in production. The
   `rosewt-arariwa/public/` directory also kept GitHub Pages leftovers (`CNAME`,
   `.nojekyll`), unnecessary under Netlify.

2. The project declared no MCP servers. Working the SPA (React 19 + Vite 8) needs
   visual validation and up-to-date library docs.

## Decision

- Netlify is the canonical deploy. A single `netlify.toml` at the repo root merges
  `base`, `NODE_VERSION=20`, security headers, `Cache-Control`, and the SPA
  redirect. The `rosewt-arariwa/netlify.toml` and the GitHub Pages leftovers
  (`public/CNAME`, `public/.nojekyll`) are removed.
- Project-level MCP tooling lives in `./.mcp.json`, committed to git: Playwright
  (`@playwright/mcp`) for visual validation, Context7 (`@upstash/context7-mcp`)
  for library docs in context.

## Consequences

- The deploy has a single source of truth; security headers and cache now apply in
  production.
- Tooling travels with the repo and is reproducible on any clone.
- Playwright MCP may require `npx playwright install` on first use; Context7 may
  require `CONTEXT7_API_KEY` if rate-limited.
- `README.md` was updated to reflect the real stack (React/Vite, not the deprecated
  Astro/Tailwind version).

## Alternatives Rejected

- Keeping both `netlify.toml` files and synchronizing them by hand.
- Configuring the MCP servers only at user level (not reproducible per clone).
