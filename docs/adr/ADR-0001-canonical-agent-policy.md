# ADR-0001: Canonical Agent Policy

- Status: Accepted
- Date: 2026-04-08

## Context

The repo already had agent-facing documents with overlapping responsibilities: `agents.md`, `CLAUDE.md`, and `.codex`.
Without a canonical rule, process drift and contradictory instructions become likely.

## Decision

- `agents.md` is the canonical execution policy for this repository.
- `CLAUDE.md` provides technical repo orientation only.
- `.codex` is a short pointer document, not a full policy document.
- Durable rationale belongs in `docs/adr/`.
- Initiative-specific execution plans belong in `docs/plans/`.

## Consequences

- Process changes must be reflected in `agents.md`.
- `CLAUDE.md` and `.codex` should stay intentionally short.
- Agents have a clear first stop for behavior and a separate home for rationale.

## Alternatives Rejected

- Keeping all agent documents fully synchronized with complete duplicated policy.
- Making `CLAUDE.md` the canonical policy file.
