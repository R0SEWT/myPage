# HCD audit of the deck (screens 01–06, navigation)

- Status: Iteration 1 done
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

## Next iterations

1. Real users: 5 short remote sessions (2 recruiters, 2 ML engineers, 1 keyboard/screen-reader) — the synthetic numbers only pick what to watch.
2. UEyes saliency on each screen: does the eye land on the claim (role, system, outcome) or on the particle cloud?
3. UXAgent-style LLM personas with PersonaHub seeds, scored against the task list above, for wording and findability (not for visuals).
4. Systems (01): the CIP lead has no artefact beside it while Wachi has video; consider an architecture diagram.
5. Contrast audit of `--v-dim-3/4` text over the field at full density.
