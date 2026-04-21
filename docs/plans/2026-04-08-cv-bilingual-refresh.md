---
status: active
owner: rody
created: 2026-04-08
updated: 2026-04-08
---

# CV bilingual refresh (EN/ES) + legacy-like layout

## Goal
- Produce two 1-page CV PDFs (`CV.en.pdf`, `CV.es.pdf`) and expose both on the website.
- Refresh CV layout to feel cleaner/less dense (closer to `cv/legacy-cv.tex`) without inventing new claims.

## Non-goals
- Adding new sections/pages to the website.
- Publishing broken links/DOIs.

## Constraints
- Narrative source of truth remains `cv/master.md`.
- Factual claims should remain traceable via `evidence/claims.md`.
- Keep Netlify build stable (`lint → check → build`).

## Work items
1. Build pipeline: compile both `cv/main.en.tex` and `cv/main.es.tex`, copy to `rosewt-astro/public/`.
2. Website: replace single CV link with two buttons (EN/ES).
3. Public hygiene: remove placeholder phone metadata; avoid dead publication links.
4. Layout: remove heavy visual clutter (e.g., section rules) and iterate toward legacy-like cleanliness.
5. Content: translate ES CV and tighten copy to fit 1 page (done by editing `cv/master.md` first, then propagate).

## Acceptance criteria
- `npm run cv` generates `rosewt-astro/public/CV.en.pdf` and `rosewt-astro/public/CV.es.pdf`.
- Header shows two working buttons pointing to EN/ES PDFs.
- JSON-LD contains real telephone number.
- Publication entries do not link to broken URLs.
- `npm run lint`, `npm run check`, `npm run build` pass.
