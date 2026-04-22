# Arariwa Design System
_Banco de Germoplasma Digital — CIP · ARV / 2026_

Dual-variant dark-mode system. Catalog, not dashboard.

## Two canonical variants

Toggle via `data-variant` on `<body>` or any container:

- `andino` — 70% Andino / 30% FMA. Carbón + hueso + cochinilla + ocre. **Default.**
- `fma` — 30% Andino / 70% FMA. Pergamino + tinta oro + rojo sangre.

## Three optional cultural layers

Opt-in via `data-culture`, additive to the variant (exposes new tokens, does not replace):

- `paracas` — textiles polícromos (indigo, granate, melón, jade)
- `nazca` — desierto y líneas (terracota, óxido, pampa, obsidiana)
- `moche` — cerámica retrato (rojo Moche, slip crema, reducción)

## Non-negotiables

- **Type**: Cormorant Garamond (display) + EB Garamond (body) + JetBrains Mono (archival). Never sans.
- **Italic ocre** for _one_ emphasis word per title, always `--accent-2`.
- **Cochinilla `--accent`** is the only saturated color. Never decorative.
- **Sharp corners.** Single allowed radius is `2px`. No soft shadows — structure is hairline, not float.
- **Seals are linework.** Circle + chakana + inscribed square. Three variants (Retrieval, Research, Systems). Minimum 32px.
- **Copy**: Spanish-first. Small-caps Quechua for ritual terms. English mono for technical shorthand.

## File map

- `colors_and_type.css` — tokens (variants, cultures, type, space, motion)
- `assets/` — seals (retrieval, research, systems), chakana master, patterns, wordmark
- `preview/` — 24 cards grouped: Colors, Type, Spacing, Components, Brand
- `ui_kits/portfolio/index.html` — full portfolio (Banco de Germoplasma) with live variant toggle
- `SKILL.md` — invocation contract

## Starting a new file

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="colors_and_type.css">
<body class="arariwa-base" data-variant="andino">
```
