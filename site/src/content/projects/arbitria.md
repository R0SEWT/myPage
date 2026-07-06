---
title: "ArbitrIA"
tagline: "Legal retrieval system for Peruvian arbitration documents."
result: "Finer chunking improves local precision but hurts global retrieval — measured, and solved with dual document/chunk-level indexing."
status: "Restricted"
stack: ["LlamaIndex", "FastAPI", "PostgreSQL", "Docker"]
links: {}
order: 1
---

## Problem

Peruvian arbitration documents are heterogeneous PDFs: multi-column layouts,
embedded tables, inconsistent headers. Complex legal queries need precision at
two scales at once — the exact clause, and the document that contains it.

## Architecture

A retrieval system combining document-level and chunk-level indexing, served
through FastAPI with PostgreSQL persistence, containerized with Docker.
Ingestion pipelines are built to survive the worst PDFs in the corpus rather
than the best.

## Design decisions & constraints

- Evaluated chunking strategies empirically: finer segmentation improves local
  precision while hurting global retrieval. That trade-off motivated the dual
  index instead of a single-granularity design.
- Robust parsing for multi-column layouts, embedded tables, and inconsistent
  headers was treated as a first-class requirement, not a preprocessing detail.

## Evidence

This system is proprietary (built for a private client), so code and corpus
are restricted. The design and results are described here at the level the
engagement allows.
