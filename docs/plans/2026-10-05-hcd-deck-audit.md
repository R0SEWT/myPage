# HCD audit of the deck (screens 01–06, navigation)

- Status: Iterations 1–12 merged (#64–#76); open items in beads
- Date: 2026-10-05

## Goal

Home (00) is settled. Bring the other screens, the screen-to-screen movement,
and the inverted white Approach screen up to the same standard, with every
change justified by a measurable task failure.

## Literature used

- Capel & Brereton, *What is Human-Centered about Human-Centered AI?*, CHI 2023 — HCD as a practice of evaluating with the people affected, not a style.
- Amershi et al., *Guidelines for Human-AI Interaction*, CHI 2019 — "make clear what the system is doing", "support efficient correction": applied to the navigation state (announcer, pill follows the section, fragments).
- Shneiderman, *Human-Centered AI: Reliable, Safe & Trustworthy*, IJHCI 2020 — high automation *and* high user control: the deck may turn pages, but never against the reader's gesture.
- Paging vs scrolling (Humanfactors / ANU–MSR mobile search studies) — paging builds a better whole-document model, but only if paging never eats reading.
- Dobres, Chahine & Reimer, Applied Ergonomics 2017 — polarity effects are mostly a *transition* problem; the cost here was the 13× luminance jump, not dark vs light.
- WCAG 2.2: 2.3.3 Animation from Interactions, 2.4.11 Focus Not Obscured, 4.1.3 Status Messages.
- Wu et al., *UIClip*, UIST 2024 — automatic UI quality judge (HF `biglab/uiclip_*`).
- Lu et al., *UXAgent*, 2025 (arXiv 2504.09407) — LLM-persona usability simulation; Agnew et al., *The Illusion of Artificial Inclusion*, CHI 2024 — its limits.
- Further tools not yet used: UEyes saliency model (CHI 2023), UICrit critique dataset (UIST 2024), PersonaHub (HF `proj-persona/PersonaHub`).

## Personas and results (baseline → iteration 1)

| Persona / task | Before | After |
|---|---|---|
| P1 recruiter, trackpad: screens per flick | 2–6 | 1 |
| P1 deliberate mouse notches (3 × 600 ms) | 3 | 3 |
| P2 phone: viewport given to content | 75% | 80% |
| P2 phone: active section visible in nav | no | yes |
| P2 phone: "Sigue" covers copy | yes | no |
| P3 keyboard: ArrowDown on a long screen | skips the rest | scrolls, turns at edge |
| P3 screen change announced | no | yes (aria-live) |
| P3b 1366×650 laptop: viewport for content | 63% | 76% |
| P4 shareable link to a screen | no | `/#research` |
| P5 reduced motion: infinite animations | 2 | 0 |
| Mean luminance, Approach vs others | 133 vs ~10 | 9 vs ~10 |
| UIClip P(after preferred), Approach desktop | — | 0.88 (noise on untouched screens ±0.15) |

## Iteration 2: contrast and saliency

### Effective contrast (audit/contrast.mjs)

Contrast measured against the field as rendered behind each text box, not
against #000. WCAG 2 ratios passed almost everything; APCA, which models
polarity, did not: body copy sat at Lc ~51 where running text needs 75.

| Desktop, ~241 text boxes | WCAG AA fails | APCA Bronze fails |
|---|---|---|
| Iteration 1 | 16 | 108 |
| Iteration 2 | 0 | 0 (stable over 2 runs; mobile 0 / 0) |

Changes: dim tiers re-set to Lc ~78/68/62/42; descriptions promoted to
dim-1; ordinals aria-hidden; local dark halo on right-column copy where the
cloud lands; labels with wide tracking moved up a tier (a halo cannot cover
the field between widely tracked glyphs).

### Predicted attention (UEyes readout, 3 s)

Model validated on the official UEyes test split (CC 0.690 vs 0.435 for
centre bias). Lift = attention share ÷ area share; >1 means the AOI draws
more than its size.

| Finding | Before | After |
|---|---|---|
| Contact CTAs (CV) lift, desktop | 0.19 | 1.46 |
| Contact CTAs (CV) lift, mobile | 0.16 | 0.79 |
| Contact CV target, mobile | 70×17 px | 134×45 px |
| Career role titles lift, desktop | 1.43 | 1.70 |
| Career role titles lift, mobile | 0.71 | 0.80 |

- Restyling the Contact links into buttons alone did not move attention
  (0.21); moving them under the address, where the gaze already is, did.
- The white Approach sheet did not steal attention from its lede (the
  baseline's AOI selectors missed its old class names; the overlays show the
  lede attended in both versions). Its cost was integration, the luminance
  jump, not attention.
- Home CTAs sit at lift ~0.5; Home is out of scope by decision.

## Iteration 3: career reading order, and a measurement fix

AOI boxes were element boxes, so a `display:block` heading counted the full
column width as its area and its lift came out low. `audit/aoi.mjs` now
uses the tight box of the rendered content (a Range), images and video
excepted. Iteration 2's lifts were all taken with the old boxes, so their
before/after comparisons hold; their absolute values do not.

With tight boxes the Career premise of rv-ngw disappears: on mobile the
role titles already drew more than their area (lift 1.63, not 0.80).
Readout noise on this screen, same build twice: ±0.02.

| Career, mobile | Role lift |
|---|---|
| main: date above role | 1.63 |
| rejected: role above date | 1.49 |
| kept: DOM role-first, date still drawn above | 1.62 |

The green date is the row's entry point and pulls the first glance onto the
role, so it stays on top visually; the DOM now reads role, org, dates, so a
screen reader hears the heading first.

## Iterations 4–12 (one PR each)

| PR | Screen / area | Finding (measured) | Result |
|---|---|---|---|
| #65 | all, a11y | axe: `scrollable-region-focusable` ×4; WCAG 2.2.2 autoplay video, manual | axe 0; video pausable, reduced-motion aware |
| #66 | 04 Career | lift 0.80 was an AOI artefact; role-above-date tested worse (1.49 vs 1.63) | DOM role-first, visual kept |
| #68 | all, i18n | Contact CV labels in the wrong language; lang toggle unmarked | names follow page language; `lang` on toggle |
| #69 | 02, mobile | publication text at ~20 ch/line; pane 3 px under the nav | 33 ch/line; 20 px + top fade |
| #70 | case studies, 404 | other design system: off-system fonts 1, colours 4/4 | 0 / 0; UIClip similarity to deck 0.862→0.910 |
| #71 | load | 180 KB of off-screen images on first load (62 %) | 289→109 KB, 10→5 requests |
| #72 | code | Arariwa leftovers carrying copy that contradicted the CV | removed; 10 pages pixel-identical |
| #73 | 03 | hover animation on rows that are not links | scoped to `a.os-row` |
| #74 | nav, mobile | 2 of 7 sections visible, no overflow cue | 3 of 7 at 390–430 px; edge cues |
| #75 | 03 | own contribution off the scanning path: 2.2 % attention | 8.1 % (lift 0.70→2.58) |
| #76 | 02 | peer-reviewed publication: 3.9 % attention | 6.3 %, order unchanged |

### Tried and rejected (kept here so nobody repeats them)

- Career, role above the green date on mobile: role lift 1.63 → 1.49.
- Open Source, contribution in `--v-ink` instead of `dim-1`: 0.54 → 0.55 mobile (noise). The readout does not respond to text colour at this scale.
- Contact, smaller "Hablemos." on mobile to lift the CV buttons: 0.88 → 0.97 (noise) while the title lost 0.306 → 0.261.
- Research, publication first: 3.9 % → 43.8 %, but the thesis fell 0.40 → 0.17. Editorial, so it is left to the author (beads `rv-6vj`).

### Whole series: original (`b400940`) vs now

UEyes readout, share of predicted attention (lift):

| Screen | desktop before | desktop now | mobile before | mobile now |
|---|---|---|---|---|
| 03 Open Source, evidence incl. contributions | 0.099 (1.44) | 0.151 (2.33) | 0.202 (0.84) | 0.144 (0.68) |
| 05 Approach, cloud vs copy | cloud 0.891 | lede 0.717 | cloud 0.837 | lede 0.559 |
| 06 Contact, CV actions | 0.001 (0.18) | 0.007 (1.37) | 0.004 (0.23) | 0.012 (0.64) |
| 04 Career, roles | 0.067 (2.33) | 0.072 (2.49) | 0.085 (1.43) | 0.098 (1.94) |

On the original Approach screen the AOI selectors miss the old class names, so its "claim" reads near 0. The overlays show its lede was attended, but the white sheet registered as one bright region (the "cloud" row). Captures and masks for all six screens: `docs/audit/summary-2026-10/`.

## Next iterations

1. Real users (beads `rv-e0j`): 5 short remote sessions (2 recruiters, 2 ML engineers, 1 keyboard/screen-reader). The synthetic numbers only decide what to watch.
2. Author decisions waiting: thesis vs publication order (`rv-6vj`), whether to link, keep or retire the case studies (`rv-7z2`), evidence URLs for Open Source (`rv-ak6`).
3. Mobile: below-the-fold items get little first-glance attention (Open Source contribution lift 0.54, `rv-a4g`; Contact CV 0.64). Test with real users before restructuring.
4. A compact "section N of 7" control for the mobile nav, if 3 of 7 visible proves too few.
5. UXAgent-style LLM personas seeded from PersonaHub, scored against the task list, for wording and findability (not visuals).
6. Systems (01): the CIP lead has no artefact beside it, while Wachi has a video (`rv-6ry`, needs evidence first).
