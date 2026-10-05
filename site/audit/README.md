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
VP=desk|mob URL=… node audit/contrast.mjs                # effective contrast over the live field
```

`contrast.mjs` hides all ink, samples the rendered background under every text
box (95th-percentile luminance per frame, median of 3 frames) and reports WCAG
2 ratio and APCA Lc against Bronze levels: 75 body copy, 60 other content
text, 45 large (>=24px; >=36px at weight <=300), 30 aria-hidden decoration.
Needs `pngjs`.

`uiclip.py` expects `before-<desk|mob>-<i>.png` / `after-…` screenshots in the
working directory and `torch`, `transformers`, `pillow`.

## Saliency (UEyes)

UEyes (Jiang et al., CHI 2023) publishes gaze heatmaps for 1,980 UIs at 1/3/7 s
and an official train/test split, but not the UMSI++ weights. So:

1. `fetch_ueyes.py` pulls only images + `heatmaps_1s/3s` out of the 12.9 GB
   Zenodo zip with HTTP range reads (~1 GB).
2. `ueyes_feats.py` caches frozen DINOv2-S features (layers 8+12, native aspect).
3. `ueyes_train.py 3s` trains a small conv readout + learned position prior.
   Official test split, CC↑/KLD↓: centre-bias only 0.435/1.21, readout
   0.690/0.64 (web 0.648/0.73, mobile 0.753/0.48).
4. `aoi.mjs` captures screens + AOI boxes (claim / CTA / evidence / chrome /
   lit cloud); `ueyes_audit.py <tags>` reports predicted 3 s attention share
   and lift (share ÷ area) per AOI. It imports `ueyes_train_defs.py`: the
   class/def blocks of `ueyes_train.py` without the training code.

`target.mjs` reports the Contact link target sizes (WCAG 2.5.8).

Free-viewing saliency is bottom-up: it predicts the first glances, not a
recruiter searching for "the CV". Use it to check that claims and actions
sit where the eye already lands, not as a findability test.
