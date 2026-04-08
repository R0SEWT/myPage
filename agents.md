# Agents Guide

## Repository Purpose

This repository contains the personal website, CV, and professional materials of Rody Vilchez.
The goal is to present a consistent narrative as an early-career **Applied ML Engineer**, focused on production-oriented AI systems.

## Canonical Policy

This file is the canonical policy for agent behavior in this repo.
If `CLAUDE.md` or `.codex` differ from this file, `agents.md` wins.

## Source of Truth

| Artifact | Source |
|---|---|
| Professional narrative & CV content | `cv/master.md` |
| Claim traceability & public support links | `evidence/claims.md` |
| Private evidence index | `.cv-vault/INDEX.md` |
| PDF rendering | `cv/main.tex` (derived from `cv/master.md`) |
| Website copy | `rosewt-astro/src/lib/constants.ts` + MDX project files (derived from `cv/master.md`) |

No public content should be invented outside `cv/master.md`.
Claims should be treated as verified through `evidence/claims.md`, and private backing documents live in `.cv-vault/`.

## Evidence Handling

Default workflow for factual tasks:
1. Read `cv/master.md` for narrative intent.
2. Read `evidence/claims.md` for claim IDs and support references.
3. Inspect `.cv-vault/INDEX.md` or underlying private files only if the user explicitly asks or if the task cannot be completed otherwise.

Rules:
- Do not inspect `.cv-vault/` by default. It is opt-in, private, and potentially token-heavy.
- Keep public artifacts out of `.cv-vault/` unless a local snapshot is required because the public resource may change or disappear.
- Do not expose private files or quote their contents into public-facing surfaces unless the user explicitly requests that behavior.
- When verifying a claim, cite the relevant `claim_id` and the support reference used.

## Positioning

**Headline:** Applied ML Engineer — RAG Systems · Document Intelligence · Data Pipelines

**Specialization axes:**
1. RAG & Retrieval Systems
2. Document Intelligence & Data Pipelines
3. Computer Vision & Multimodal ML
4. Systems Engineering & Deployment

**Avoid framing as:**
- "AI enthusiast", "Data & AI Enthusiast"
- Generic "student portfolio"
- Course-based work without system context
- "used X", "learned Y", "familiar with Z"

## Writing Style

All content must emphasize **systems over isolated models**.

**Project descriptions must follow this structure:**
1. What system was built and what problem it addresses
2. Architecture and key design decisions
3. Technical constraints handled (latency, API limits, noisy data, compute budget)
4. Impact, metrics, or validation — only when real

**Never:**
- Fabricate metrics or claims
- Use vague descriptions ("various techniques", "multiple tools")
- Frame production work as academic exercises
- Add "used X" bullets without explaining architectural role

**When metrics are unavailable**, emphasize:
- System complexity and scale
- Engineering constraints handled
- Design tradeoffs made and why

## Consistency Rules

- CV, website, and docs must share the same project names
- Descriptions are adapted per surface (concise for CV, expanded for web) but never contradictory
- No duplication with conflicting detail levels
- Tone: technical, sober, systems-oriented

## Evolution Protocol

When updating factual content:
1. Modify `cv/master.md` first
2. Update `evidence/claims.md` if the claim text, dates, or support references changed
3. Update `.cv-vault/INDEX.md` if new private evidence was added
4. Propagate to `cv/main.tex`
5. Propagate to website (`constants.ts`, MDX files)
6. Verify cross-consistency

## Project Inclusion Criteria

**Include:** Systems with demonstrable architecture, real technical decisions, and production or research constraints.

**Exclude:** Toy projects, tutorial follow-alongs, clustering exercises without system context.

## Priority

Correctness > consistency > aesthetics
