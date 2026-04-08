# ADR-0003: Agentic Development Workflow

- Status: Accepted
- Date: 2026-04-08

## Context

Multi-step work was being planned ad hoc in chat. That makes handoff difficult and causes repeated re-decisions on scope, file ownership, and acceptance criteria.

## Decision

- Use `docs/plans/` for decision-complete initiative plans.
- Every plan must declare a status from: `proposed`, `active`, `blocked`, `done`, or `superseded`.
- Plans must state the exact artifacts or subsystems they affect, the decisions already taken, and acceptance criteria.
- If a change introduces a durable process or architecture decision, create or update an ADR before considering the initiative complete.
- Standards documents define the reusable conventions that plans should reference rather than restate.

## Consequences

- Agents can pick up substantial work without rebuilding the same context from scratch.
- Temporary plans do not replace durable ADRs.
- Workflows become easier to review, resume, or supersede.

## Alternatives Rejected

- Tracking all plans only in transient chat history.
- Using ADRs for temporary initiative planning.
