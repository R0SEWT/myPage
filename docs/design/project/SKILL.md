---
name: arariwa-design
description: Use this skill to generate well-branded interfaces and assets for Arariwa, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. The system fuses FMA-style alchemical geometry with Andean/Peruvian textile iconography, anchored in the Papa Arariwa concept — a "banco de germoplasma" for creative/technical work.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Always start HTML files with `<link rel="stylesheet" href="colors_and_type.css">` (relative path depending on where you place the file) — this loads the full palette, type, and motion tokens.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

**Non-negotiables for Arariwa work:**
- Serif display (Cormorant Garamond) + mono (JetBrains Mono). Never sans-serif.
- Spanish-first copy, with Quechua small-caps and English mono accents. No emoji.
- One saturated color only: cochineal `#A0281E`. No neon, no gradients.
- Sharp corners by default. No rounded-card-with-colored-left-border tropes.
- Seals (the three per-domain marks) are the primary iconography. No Lucide/Heroicons substitution.
- Motion must mean something. Default to stillness.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
