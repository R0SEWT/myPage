# Claims Registry

This file is the lightweight traceability layer for factual claims used in the CV and website.
Agents should read this file before touching `.cv-vault/`.

## Contract

Each claim block should keep the same fields:

- `claim_id`: stable short identifier
- `surface`: `cv`, `web`, or `both`
- `publicable`: `yes` or `no`
- `claim`: factual statement that may appear in a public surface
- `supports`: one or more support references

Support references use one of these prefixes:

- `repo`: public source repository
- `public_url`: public page, profile, demo, release, or PDF
- `paper`: paper page, preprint, or publication record
- `vault_doc`: local private evidence indexed in `.cv-vault/INDEX.md`, including private emails or publisher records
- `screenshot`: local snapshot indexed in `.cv-vault/INDEX.md`

## Experience

### exp-cip-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: AI / Data Intern at International Potato Center (CIP, CGIAR), Lima, Peru, Apr 2026 to present.
- `supports`:
  - `vault_doc`: `cip_employment_2026_04`
  - `public_url`: `https://www.linkedin.com/in/r0sewt/`

### exp-visma-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: QA Engineer Intern at Visma LATAM, Lima, Peru, Dec 2024 to Mar 2025.
- `supports`:
  - `vault_doc`: `visma_employment_2024_12`
  - `public_url`: `https://www.linkedin.com/in/r0sewt/`

## Systems

### sys-ask-papa-001
- `surface`: `both`
- `publicable`: `no`
- `claim`: Internal collaboration on a document intelligence and RAG workflow within current work at CIP; keep as internal context, not as a public claim to verify externally.
- `supports`:
  - `public_url`: `https://rosewt.dev/`

### sys-arbitria-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built a legal-domain RAG system for Peruvian arbitration documents with dual indexing and contextual QA.
- `supports`:
  - `repo`: `https://github.com/ArbitrIA`
  - `public_url`: `https://rosewt.dev/`

### sys-nao-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built a vision and robotics system for NAO emotion detection with optimized inference and end-to-end response handling.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/Nao-CNN-Emotion`
  - `public_url`: `https://rosewt.dev/`

### sys-housing-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built a large-scale data pipeline and predictive modeling workflow over 1.5M Danish housing transactions.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/Denmark-HousePrices-Analysis`
  - `public_url`: `https://rosewt.dev/`

## Research

### res-imitator-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Co-authored the multimodal sign language translation system "Imitator", accepted for Springer CCIS 2026 and pending publication.
- `supports`:
  - `repo`: `https://github.com/nakato156/Multimodal-Sign-Language-Model`
  - `vault_doc`: `imitator_springer_publication_record`

## Education

### edu-upc-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: B.Sc. Computer Science student at UPC, expected graduation in 2026-2.
- `supports`:
  - `public_url`: `https://www.linkedin.com/in/r0sewt/`

## Certifications

### cert-datacamp-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: AI Engineer for Data Scientists Associate by DataCamp.
- `supports`:
  - `vault_doc`: `datacamp_ai_engineer_associate`

### cert-gcloud-ml-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Machine Learning Specialization by Google Cloud Skills Boost.
- `supports`:
  - `vault_doc`: `gcloud_ml_specialization`

### cert-google-da-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Professional Data Analytics Certificate by Google.
- `supports`:
  - `vault_doc`: `google_data_analytics_certificate`

### cert-p4e-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Python for Everybody by the University of Michigan.
- `supports`:
  - `vault_doc`: `python_for_everybody_certificate`
