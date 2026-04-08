# Plan Lifecycle Standard

## When to Create a Plan

Create or update a plan in `docs/plans/` when work:

- spans multiple files or subsystems
- needs durable decisions to be carried across sessions
- is likely to be resumed, delegated, or reviewed later

## Plan Statuses

- `proposed`: scoped but not yet being executed
- `active`: currently driving implementation
- `blocked`: cannot proceed until an external dependency or decision is resolved
- `done`: implemented and no longer the active source of work
- `superseded`: replaced by another plan

## File Naming

Use:

`YYYY-MM-DD-short-slug.md`

## Decision-Complete Requirement

A plan should be decision-complete before heavy implementation starts.
That means the implementer should not need to guess:

- what to change
- where to change it
- what constraints apply
- how success will be checked

## Maintenance Rules

- Update the status when work meaningfully changes state.
- Link relevant ADRs instead of repeating stable rationale.
- Supersede old plans instead of editing history until it becomes ambiguous.
