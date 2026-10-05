# HCD audit of the deck (screens 01–06, navigation)

- Status: Iteration 3 done
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

## Next iterations

1. Real users: 5 short remote sessions (2 recruiters, 2 ML engineers, 1 keyboard/screen-reader) — the synthetic numbers only pick what to watch.
3. UXAgent-style LLM personas with PersonaHub seeds, scored against the task list above, for wording and findability (not for visuals).
4. Systems (01): the CIP lead has no artefact beside it while Wachi has video; consider an architecture diagram.
