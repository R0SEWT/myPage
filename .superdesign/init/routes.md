# Routes

Astro 5 static site with file-based routing. There is no router configuration file.

| URL | Entry | Shared layout | Summary |
|---|---|---|---|
| `/` | `site/src/pages/index.astro` | `BaseLayout`, `Header`, `Footer` | Hero, selected systems, experience, research, skills, contact. |
| `/projects/:slug/` | `site/src/pages/projects/[slug].astro` | `BaseLayout`, `Header`, `Footer` | Static case study generated from each projects collection entry. |
| `/404` | `site/src/pages/404.astro` | `BaseLayout`, `Header`, `Footer` | Not-found message and return link. |

Content collection routing is defined by `site/src/content.config.ts`; the dynamic route calls `getCollection('projects')` and maps each entry ID to a static path.
