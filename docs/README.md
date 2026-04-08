# Docs as Code

This repository uses docs as code for durable decisions, active implementation plans, and working conventions that agents should follow.

## Structure

- `docs/adr/`: accepted architectural and process decisions that should not be re-litigated every session
- `docs/plans/`: decision-complete initiative plans for multi-step work
- `docs/standards/`: living conventions for evidence, plans, and authoring rules

## Usage Rules

- Update or add an ADR when a durable decision changes repo policy, evidence modeling, or the agent workflow.
- Create or update a plan before substantial multi-step work that spans multiple files or decisions.
- Update standards when a convention changes but does not require a new ADR.
- Keep `agents.md` aligned with accepted ADRs. If there is temporary drift, `agents.md` remains the execution-time policy until reconciled.

## Precedence

1. `agents.md` for active execution behavior in this repo
2. accepted ADRs for durable rationale and architectural decisions
3. standards for conventions and data contracts
4. plans for initiative-specific execution details
