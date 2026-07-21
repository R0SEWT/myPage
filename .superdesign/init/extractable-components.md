# Extractable components

## Header
- Source: `site/src/components/Header.astro`
- Category: layout
- Description: Sticky primary navigation and CV action; desktop and wrapped mobile states are defined in global CSS.
- Extractable props: none for exploration; links and labels remain hardcoded.
- Hardcoded: RV wordmark, `rosewt.dev`, Projects, Experience, Contact, Download CV, CSS classes.

## Footer
- Source: `site/src/components/Footer.astro`
- Category: layout
- Description: Contact and supporting credentials footer.
- Extractable props: none for exploration.
- Hardcoded: Contact title, profile links, certifications, activities, education, CSS classes.

## Hero
- Source: `site/src/components/Hero.astro`
- Category: layout
- Description: Identity, role, summary, CTAs, and quick-facts composition.
- Extractable props: none; the design task changes hierarchy rather than runtime state.
- Hardcoded: labels, link destinations, brand seal, CSS classes.

## ProjectRow
- Source: `site/src/components/ProjectRow.astro`
- Category: basic
- Description: Project evidence row with thumbnail, status, claim, stack, and links.
- Extractable props: none for this exploration; content will differ per item and should be authored inline.
- Hardcoded: visual structure, link labels, placeholder seal, CSS classes.
