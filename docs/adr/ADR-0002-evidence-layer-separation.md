# ADR-0002: Evidence Layer Separation

- Status: Accepted
- Date: 2026-04-08

## Context

The repo needs factual traceability for CV and website claims, but private documents and heavy artifacts should not be scanned by default or committed to Git.
Public claims, narrative content, and private evidence each have different privacy and maintenance requirements.

## Decision

- `cv/master.md` is the narrative source of truth.
- `evidence/claims.md` is the factual traceability registry for public and internal claims.
- `.cv-vault/INDEX.md` indexes private evidence stored locally in `.cv-vault/`.
- `.cv-vault/` remains opt-in, ignored by Git, and should not be inspected unless the user explicitly requests it or the task requires it.
- Public artifacts stay in `evidence/claims.md`; private backups or snapshots may live in `.cv-vault/` only when justified.

## Consequences

- Agents can answer most factual questions from `evidence/claims.md` without opening private files.
- Sensitive work claims can remain traceable while marked non-public.
- The evidence system stays cheap in tokens and safe by default.

## Alternatives Rejected

- Storing all evidence directly in Git.
- Using only one registry for both public links and private files without separation.
