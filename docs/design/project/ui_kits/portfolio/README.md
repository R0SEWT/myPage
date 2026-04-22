# Arariwa Portfolio — "Banco de Germoplasma"

A portfolio surface where each project is catalogued as a **specimen** in a germplasm bank.

## Screens
- `index.html` — catalog index (hero + grid of specimens + sections)
- `specimen.html` — single-specimen detail (provenance, constraints, process, outcome)
- `about.html` — the anchor narrative (Papa Arariwa + law of equivalent exchange)

## Components (`components/`)
- `Header.jsx` — wordmark + nav + index counter
- `Hero.jsx` — display type + anchor quote + seal
- `SpecimenCard.jsx` — catalog-entry row
- `SpecimenGrid.jsx` — section wrapping a group of cards
- `SealBlock.jsx` — large seal with section title (activates on scroll)
- `Footer.jsx` — colophon with law + quechua triplet
- `Tag.jsx`, `Button.jsx`, `Meta.jsx` — small primitives

Shared atoms live in `components/atoms.jsx`.
