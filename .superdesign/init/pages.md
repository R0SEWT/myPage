# Page dependency trees

## `/` — Homepage

Entry: `site/src/pages/index.astro`

Dependencies:
- `site/src/layouts/BaseLayout.astro`
  - `site/src/styles/tokens.css`
  - `site/src/styles/global.css`
  - `@fontsource-variable/inter`
  - `@fontsource-variable/jetbrains-mono`
- `site/src/components/Header.astro`
  - `site/src/data/profile.ts`
- `site/src/components/Hero.astro`
  - `site/src/data/profile.ts`
  - `site/public/assets/brand/seal-systems.svg`
- `site/src/components/ProjectRow.astro`
  - `site/src/content.config.ts`
  - `site/src/content/projects/arbitria.md`
  - `site/src/content/projects/lumi.md`
  - `site/src/content/projects/potato-achis.md`
  - `site/src/content/projects/gallstone-risk.md`
  - `site/public/assets/brand/seal-systems.svg`
  - `site/public/assets/projects/gallstone-architecture.png`
- `site/src/components/Experience.astro`
  - `site/src/data/profile.ts`
- `site/src/components/Research.astro`
  - `site/src/data/profile.ts`
- `site/src/components/Footer.astro`
  - `site/src/data/profile.ts`
- `site/public/assets/brand/seal-retrieval.svg`

The page has one render branch. Responsive behavior is CSS-only at 58rem and 44rem breakpoints.

## `/projects/:slug/` — Project case study

Entry: `site/src/pages/projects/[slug].astro`

Dependencies:
- `site/src/layouts/BaseLayout.astro`
  - `site/src/styles/tokens.css`
  - `site/src/styles/global.css`
- `site/src/components/Header.astro`
  - `site/src/data/profile.ts`
- `site/src/components/Footer.astro`
  - `site/src/data/profile.ts`
- `site/src/content.config.ts`
- `site/src/content/projects/*.md`

## `/404` — Not found

Entry: `site/src/pages/404.astro`

Dependencies:
- `site/src/layouts/BaseLayout.astro`
  - `site/src/styles/tokens.css`
  - `site/src/styles/global.css`
- `site/src/components/Header.astro`
  - `site/src/data/profile.ts`
- `site/src/components/Footer.astro`
  - `site/src/data/profile.ts`
