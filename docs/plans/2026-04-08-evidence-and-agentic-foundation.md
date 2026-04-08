# Plan: Evidence And Agentic Foundation

- Status: proposed
- Date: 2026-04-08

## Summary

Harden the evidence model, align the narrative with what is actually supportable today, and add a light agentic workflow so future work is resumable and automation-friendly.

## Decisions Already Taken

- `agents.md` remains the canonical execution policy.
- `cv/master.md` is narrative truth; `evidence/claims.md` is factual traceability; `.cv-vault/INDEX.md` indexes private evidence.
- `Ask-Papa` is work-sensitive and should remain internal-only in the claims layer.
- `Imitator` may be backed by a private Springer publisher record.
- UPC should be tracked with a reduced claim until stronger evidence exists.
- `Winter Camp AI 2025` stays out of the claims registry until proof is recovered.

## Implementation Slices

### 1. Narrative Alignment

- Target artifacts: `cv/master.md`, `evidence/claims.md`, website-derived content as needed
- Required changes:
  - remove or reduce unsupported narrative claims
  - keep naming consistent across CV and web surfaces
  - ensure sensitive work stays internal-only in traceability
- Acceptance criteria:
  - no claim in public-facing surfaces contradicts the registry
  - sensitive work claims are clearly marked non-public

### 2. Claims Registry V2

- Target artifacts: `evidence/claims.md`, `docs/standards/claims-registry.md`
- Required changes:
  - consider adding optional fields like `status` and `sensitivity`
  - split large bundled claims into smaller verifiable units where useful
  - keep support references minimal and real
- Acceptance criteria:
  - each important public claim is independently traceable
  - no `vault_doc` points to a missing index entry

### 3. Evidence Validator

- Target artifacts: `rosewt-astro/scripts/verify-evidence.mjs`, `rosewt-astro/package.json`
- Required changes:
  - add a script that validates `claim_id` uniqueness
  - validate each `vault_doc` against `.cv-vault/INDEX.md`
  - validate each indexed file path exists on disk
- Acceptance criteria:
  - a single command reports broken references and duplicate IDs
  - validation runs without mutating tracked files

### 4. Public Evidence Subset

- Target artifacts: `evidence/public-evidence.md`
- Required changes:
  - curate only safe, public-facing proofs such as papers, awards, selected certs, and repos
  - exclude private or work-sensitive evidence
- Acceptance criteria:
  - the subset can feed a future web section without exposing private material
  - every public item maps back to a real claim

## Risks and Notes

- Narrative drift can reappear if `cv/master.md` changes without registry updates.
- Sensitive work claims need deliberate review before becoming public.
- Private evidence should remain opt-in even if automation is added.

## Related ADRs

- `ADR-0001`
- `ADR-0002`
- `ADR-0003`
