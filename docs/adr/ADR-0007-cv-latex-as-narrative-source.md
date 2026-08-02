# ADR-0007: The CV LaTeX bundle is the narrative source

- Status: Accepted
- Date: 2026-08-02
- Supersedes: ADR-0004
- Amends: ADR-0002 (the `cv/master.md` bullet only)

## Context

`cv/master.md` held the professional narrative, and `cv/main*.tex` rendered a
PDF from it. In practice the narrative was maintained twice: an edit had to be
written in Markdown and then restated in LaTeX, and the two drifted. The build
script that tied them together (`scripts/build-cv.sh`) was removed during the
Astro cutover in `08f2fab` and never replaced, so the propagation step existed
only as a rule in this repository's own documentation.

The CV is now authored directly in LaTeX as a versioned bundle under `cv/`,
with `cv/master.md`, `cv/main*.tex` and `cv/legacy-cv.tex` retired.

## Decision

- The narrative source is the highest-numbered `cv/Rody_Vilchez_CV_v<N>_bundle/`
  directory. Naming the rule rather than the version means a version bump does
  not require editing this repository's policy files.
- That bundle holds three tracked files: `Rody_Vilchez_CV_ES_v<N>.tex`,
  `Rody_Vilchez_CV_EN_v<N>.tex` and the shared `cv_style_v<N>.tex`.
- **Spanish and English are peers, not translations.** Neither derives from the
  other. They must not disagree on any fact; they may differ in phrasing,
  emphasis and ordering.
- `evidence/claims.md` remains the factual arbiter. When the two language
  editions disagree on a fact, the registry decides — not seniority between
  them.
- PDFs are build output. The bundle's compiled PDFs are ignored by Git; the
  published pair is committed at `site/public/CV.es.pdf` and `CV.en.pdf` and is
  updated by copying from the bundle.

## Consequences

- One narrative layer instead of two. An edit is written once, in the language
  edition it belongs to, and mirrored into the other.
- The factual-consistency burden moves from "keep LaTeX in step with Markdown"
  to "keep ES and EN in step with each other and with the registry". That is a
  smaller obligation but a less mechanical one: nothing detects divergence, so
  it has to be checked when either edition changes.
- No pipeline compiles or copies the PDFs. Until one exists, publishing a CV is
  a manual step and can silently be skipped — which is exactly how
  `site/public/CV.*.pdf` came to advertise a retired email address for a month.
- `cv/sections/*.tex` are no longer read by anything: the bundle inputs only
  `cv_style_v<N>.tex`. They are left in place pending a decision.

## Alternatives Rejected

- **Keep `cv/master.md` as canonical and treat the bundle as a renderer.** This
  is ADR-0004's model. It failed in practice for the reason above: the
  propagation step had no automation behind it and stopped happening.
- **Make one language canonical and the other a derived translation.** The two
  `.tex` files are structurally peers, each self-contained. Declaring a
  hierarchy the files do not have would be a rule nothing enforces.
- **Track the compiled PDFs in the bundle.** They would duplicate the committed
  copies under `site/public/` with no way to tell which pair is current.
