# ADR-0004: Bilingual CV artifacts (EN/ES)

## Status
Accepted

## Context
The repository publishes a CV PDF via the website and maintains a canonical narrative in `cv/master.md` with a separate evidence layer in `evidence/claims.md`.

We want to publish two CV PDFs (English and Spanish) while keeping:
- one narrative source of truth (canonical intent),
- factual consistency across public surfaces,
- stable Netlify builds.

## Decision
- We will publish two CV PDFs: `rosewt-astro/public/CV.en.pdf` and `rosewt-astro/public/CV.es.pdf`.
- The LaTeX entrypoints are `cv/main.en.tex` and `cv/main.es.tex`.
- The build script `rosewt-astro/scripts/build-cv.sh` compiles both and copies them into the website `public/` folder.
- Content edits must start in `cv/master.md`. Spanish content is treated as a derived translation of the canonical narrative and must not introduce new factual claims.

## Consequences
- The website header renders two CV download buttons (EN/ES).
- There is an ongoing maintenance responsibility to keep EN/ES CV content aligned with the canonical narrative and evidence layer.
