# Agents Guide

## Repository Purpose

This repository contains the personal website, CV, and professional materials of Rody Vilchez.
The goal is to present a consistent narrative as an early-career **Applied ML Engineer**, focused on production-oriented AI systems.

---

## Source of Truth

| Artifact | Source |
|---|---|
| Professional narrative & CV content | `cv/master.md` |
| PDF rendering | `cv/main.tex` (derived from master.md) |
| Website copy | `rosewt-astro/src/lib/constants.ts` + MDX project files (derived from master.md) |

No content should be invented outside `cv/master.md`. All surfaces derive from it.

---

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

---

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

---

## Consistency Rules

- CV, website, and docs must share the same project names
- Descriptions are adapted per surface (concise for CV, expanded for web) but never contradictory
- No duplication with conflicting detail levels
- Tone: technical, sober, systems-oriented

---

## Evolution Protocol

When updating content:
1. Modify `cv/master.md` first
2. Propagate to `cv/main.tex`
3. Propagate to website (`constants.ts`, MDX files)
4. Verify cross-consistency

---

## Project Inclusion Criteria

**Include:** Systems with demonstrable architecture, real technical decisions, and production or research constraints.

**Exclude:** Toy projects, tutorial follow-alongs, clustering exercises without system context.

---

## Priority

Correctness > consistency > aesthetics
