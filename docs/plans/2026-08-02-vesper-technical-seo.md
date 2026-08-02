# Plan: Vesper Technical SEO and Discoverability

- Status: done
- Date: 2026-08-02

## Summary

Publish discoverability metadata and crawl artifacts for Vesper v3 without
changing its approved design, copy, motion, or interaction.

## Decisions Already Taken

- Keep `/` as the deck's single canonical document; see `ADR-0006`.
- Index only real Astro documents and exclude the 404 document.
- Do not add language aliases, `hreflang`, SPA redirects, sitemap priorities, or
  change frequencies.

## Implementation Slices

### 1. Crawl and install artifacts

- Target artifacts: Astro config, sitemap integration, `robots.txt`, web manifest.
- Required changes: generate a sitemap from Astro routes and link public crawl
  and install artifacts from both layouts.
- Acceptance criteria: build output contains exactly the five canonical URLs,
  robots points at the sitemap index, and `/404` is absent from the sitemap.

### 2. Search and social metadata

- Target artifacts: shared layouts, Home JSON-LD, social preview, favicon.
- Required changes: publish complete OG/Twitter image metadata, a `ProfilePage`
  with a factual `Person`, and Vesper-native brand assets.
- Acceptance criteria: absolute 1200×630 preview metadata and valid JSON-LD.

### 3. Error document

- Target artifacts: `404.astro`, configurable layout robots metadata.
- Required changes: apply the Vesper visual system without mounting the deck
  shell and declare `noindex, follow`.
- Acceptance criteria: standalone 404 with the required robots directive.

## Risks and Notes

- `public/llms.txt` remains intentionally unchanged. Its synchronization is
  blocked until it can be reconciled with `cv/master.md` and
  `evidence/claims.md` as a separate content/CV task.
- CV PDFs are outside this pass and remain untouched.

## Related ADRs

- `ADR-0006`
