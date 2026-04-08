# Evidence Vault Standard

## Purpose

`.cv-vault/` stores private or heavy evidence that should remain local and opt-in.

## Directory Layout

- `.cv-vault/certificaciones/`
- `.cv-vault/constancias-laborales/`
- `.cv-vault/educacion/`
- `.cv-vault/otros-soportes/`

## Naming Convention

Use:

`YYYY-MM-DD__issuer__type__slug.ext`

Examples:

- `2025-09-16__datacamp__certification__ai-engineer-for-data-scientists-associate.pdf`
- `2026-04-01__cip__employment__practices-renewal.pdf`

## Index Rules

- Every file used for traceability must have a `doc_id` entry in `.cv-vault/INDEX.md`.
- `.cv-vault/INDEX.md` should only contain real files, not placeholders.
- The `claim_id` in the index must reference a real claim or be left intentionally empty only for unclaimed archival material.

## Privacy Rules

- Do not inspect `.cv-vault/` by default.
- Do not quote private evidence into public artifacts unless the user explicitly requests it.
- Prefer public links in `evidence/claims.md` when they are sufficient.
