# Deck audit harness

Synthetic-persona checks for the Vesper deck. They measure behaviour, not
opinion: each persona runs a task and reports a number or a pass/fail.
Synthetic users do not replace people (Agnew et al., CHI 2024); this catches
regressions between real sessions. Plan and findings:
`docs/plans/2026-10-05-hcd-deck-audit.md`.

Run against a preview (`npm run build && npx astro preview`). Playwright and
Chromium are not project dependencies; install them in a scratch dir.

```bash
URL=http://localhost:4321/ node audit/personas.mjs      # P1–P5 task metrics
BASE=<old> URL=<new> node audit/flick.mjs                # wheel gestures, in-page timing
python audit/uiclip.py desk|mob                          # UIClip before/after judge
```

`uiclip.py` expects `before-<desk|mob>-<i>.png` / `after-…` screenshots in the
working directory and `torch`, `transformers`, `pillow`.
