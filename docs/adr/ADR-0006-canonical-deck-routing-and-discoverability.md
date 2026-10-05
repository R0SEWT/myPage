# ADR-0006: Canonical Deck Routing and Discoverability

- Status: Accepted
- Date: 2026-08-02

## Context

The Vesper v3 home is one statically generated Astro document at `/`. Its seven
screens and both languages are present in that document; client code changes
only screen visibility and the displayed language. Treating those states as
fourteen routes would publish duplicate documents rather than distinct pages.

The four project case studies are separate Astro documents with their own
content and therefore remain independently addressable and indexable.

## Decision

- `/` is the deck's only canonical URL.
- Screen and language states do not receive aliases, redirects, or canonical
  URLs of their own.
- `hreflang` is omitted until Spanish and English exist as separate documents.
- The generated sitemap represents real static documents only: `/` and the four
  current `/projects/*/` case studies. `/404` is filtered out.
- The custom 404 remains a separate static error document and declares
  `noindex, follow`.

## Consequences

Search engines receive one unambiguous deck URL without duplicate language or
section variants. Case studies retain direct discovery. Adding independently
generated language documents in the future requires revisiting canonical and
`hreflang` policy.

## Alternatives Rejected

- Fourteen ES/EN section routes that render the same deck document.
- SPA redirects or aliases for states that are not Astro pages.
- `hreflang` annotations pointing to client-side states rather than documents.

## Addendum (2026-10-05): screen fragments

The deck writes the current screen into the URL fragment (`/#research`) with
`history.replaceState` and opens on the screen a fragment names, so a screen
can be shared. This is consistent with the decision above: a fragment is not a
separate document, is never requested from the server, and does not receive a
canonical, alias, redirect or sitemap entry. `replaceState` (not `pushState`)
keeps Back leaving the site instead of rewinding the deck.
