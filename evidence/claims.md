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
- `claim`: AI Intern at International Potato Center (CIP, CGIAR), Lima, Peru, Oct 2025 to present.
- `supports`:
  - `vault_doc`: `cip_employment_2025_10`
  - `vault_doc`: `cip_employment_2026_04`
  - `public_url`: `https://www.linkedin.com/in/r0sewt/`

### exp-visma-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: QA Trainee at Visma LATAM, Lima, Peru, Dec 2024 to Oct 2025.
- `supports`:
  - `vault_doc`: `visma_employment_2024_12`
  - `vault_doc`: `visma_employment_2025_04`
  - `vault_doc`: `visma_employment_2025_09`
  - `public_url`: `https://www.linkedin.com/in/r0sewt/`

## Systems

### sys-cip-agents-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Architected and shipped an institutional multi-agent platform on Copilot Studio in Microsoft Teams at CIP, for IT support and corporate services, with cross-domain delegation and escalation to tickets prefilled from conversational context and subject to human review.
- `supports`:
  - `vault_doc`: `cip_employment_2026_04`

### sys-cip-eval-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built an agent-based evaluation suite at CIP in which evaluator agents execute scenarios derived from operational records, combining deterministic regression, provider-agnostic LLM-as-judge scoring, and persona-driven simulation to attribute routing, delegation, and response-quality failures.
- `supports`:
  - `vault_doc`: `cip_employment_2026_04`

### sys-cip-graphrag-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built end-to-end the document-intelligence layer powering a five-language agricultural GraphRAG at CIP over corpora with noisy OCR and irregular layouts, covering parsing, chunking, structured metadata extraction, embeddings, and vector storage.
- `supports`:
  - `vault_doc`: `cip_employment_2026_04`

### sys-visma-testgen-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built an LLM-driven agent at Visma LATAM that transforms functional specifications into executable end-to-end test scenarios.
- `supports`:
  - `vault_doc`: `visma_employment_2025_09`

### sys-visma-dom-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Engineered DOM-aware selector and state extraction at Visma LATAM, integrating generated Cypress suites into Jenkins as regression coverage for critical workflows.
- `supports`:
  - `vault_doc`: `visma_employment_2025_09`

### sys-arbitria-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built a legal retrieval system for Peruvian arbitration documents with dual indexing and contextual QA.
- `supports`:
  - `repo`: `https://github.com/ArbitrIA`

### sys-geno-map-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built a correspondence-free validation framework (GENO-MAP) for high-dimensional data analysis using kNN graph invariants.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps`

### sys-gallstone-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built a gallstone risk prediction system (Gallstone Risk) for resource-constrained screening, with a human-in-the-loop SHAP inspection interface.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/gallstone-risk-rural-peru-ml`
  - `public_url`: `https://gallstone.rosewt.dev/`

### sys-nao-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built a vision and robotics system for NAO emotion detection with optimized inference and end-to-end response handling.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/Nao-CNN-Emotion`

### sys-housing-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built a large-scale data pipeline and predictive modeling workflow over 1.5M Danish housing transactions.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/Denmark-HousePrices-Analysis`

### sys-potato-achis-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built potato-achis, a multi-source domain feature adaptation network (MDFAN) for Andean potato disease classification, with Andean field augmentations, open-set OOD rejection, and timm backbones (MobileNetV3/ResNet50), on a modern Python stack (uv, ruff, mypy, pytest, Hydra).
- `supports`:
  - `repo`: `https://github.com/R0SEWT/potato-achis`

### sys-lumi-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built Lumi, a caregiver copilot that wraps LLM-generated proposals in deterministic medical-safety boundaries — a FastAPI service with Azure OpenAI, ports/adapters (hexagonal) architecture, and CI with tests, packaged for Docker-based deployment to Azure App Service.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/dermatomicos-Bago`

### sys-wachi-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built a geospatial system (Wachi) that re-ranks pedestrian routes by spatiotemporal risk in Lima using H3 surfaces, temporal decay, and six time bands, for an interactive data-journalism experience with El Comercio Lab.
- `supports`:
  - _No support reference yet._ The working repository is private and the public
    `R0SEWT/inwach` holds only a LICENSE. This claim is already published on the CV
    and the deck without traceable backing — see `rv-nbt`.

## Research

### res-infelix-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Built a Bayesian model over victimization surveys and an 11-source H3 geospatial panel (Sentinel-2, VIIRS, OSM, WorldPop, Street View) to estimate crime risk across 43 Lima–Callao districts, as B.Sc. thesis research at UPC (2025–2026); census data were the only source that consistently improved predictions within districts.
- `supports`:
  - `public_url`: `https://r0sewt.github.io/infelix/`

### res-infelix-002
- `surface`: `both`
- `publicable`: `yes`
- `claim`: In Infelix, features learned in Lima matched models trained with one year of local data in Arequipa and remained competitive in Cusco and Piura; stress tests showed that record quality, not architecture alone, determines when the system can be evaluated and transferred.
- `supports`:
  - `public_url`: `https://r0sewt.github.io/infelix/`

### res-imitator-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Co-authored the multimodal sign language translation system "Imitator", presented at WAILAMP 2025 and SIMBIG 2025 and published in Springer CCIS 2895 (2026), DOI 10.1007/978-3-032-20322-9_23.
- `supports`:
  - `paper`: `https://doi.org/10.1007/978-3-032-20322-9_23`
  - `repo`: `https://github.com/nakato156/Multimodal-Sign-Language-Model`
  - `vault_doc`: `imitator_simbig_authorship_2025_10`
  - `vault_doc`: `imitator_springer_publication_record`

## Open Source

Claim text here follows what the linked artifact actually shows, including merge
state. The CV bundle, `site/src/data/deck.ts` and `site/public/llms.txt` all
state the scikit-learn and Gemini CLI contributions more strongly than their
evidence supports; the registry is the arbiter until they are brought in
line — see `rv-486`.

### oss-copilot-studio-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Reported and diagnosed a knowledge-source synchronization failure for child agents in Microsoft's official Copilot Studio VS Code extension, and validated the prerelease fix; issue closed Jul 6, 2026.
- `supports`:
  - `public_url`: `https://github.com/microsoft/vscode-copilotstudio/issues/324`

### oss-beads-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Authored the prefix-routed write-through fix for `bd mol bond` in beads, together with the `TestMolBondPrefixRoutedWriteThrough` regression test that the maintainer identified as what distinguished this contribution from earlier attempts; the commit was carried into the upstream consolidation branch under contributor-first attribution. Pull request open with maintainer commits as of Aug 2026.
- `supports`:
  - `public_url`: `https://github.com/gastownhall/beads/pull/4720`
  - `public_url`: `https://github.com/gastownhall/beads/issues/4714`

### oss-gemini-cli-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Opened a pull request against Google's Gemini CLI adding missing `CustomTheme` properties to the settings validation schema, with regression coverage across eight files. Open and awaiting review since May 11, 2026 — not merged.
- `supports`:
  - `public_url`: `https://github.com/google-gemini/gemini-cli/pull/26844`

### oss-hdbscan-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Merged a documentation fix in `scikit-learn-contrib/hdbscan` restoring a broken DOI link in the README. This is the scikit-learn-contrib ecosystem, not scikit-learn core, and the change is a link fix rather than a technical-documentation rewrite.
- `supports`:
  - `public_url`: `https://github.com/scikit-learn-contrib/hdbscan/pull/692`

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

### cert-ibm-genai-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Generative AI Fundamentals by IBM.
- `supports`:
  - `vault_doc`: `ibm_genai_fundamentals`

### cert-google-cyber-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Cybersecurity: Defense against the Digital Dark Arts by Google.
- `supports`:
  - `vault_doc`: `google_cybersecurity_defense`

### cert-tec-hcai-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Human-Centered AI by Tecnológico de Monterrey.
- `supports`:
  - `vault_doc`: `tec_human_centered_ai`

### cert-wtc-gh900-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: GH-900T00 training certificate by WTC.
- `supports`:
  - `vault_doc`: `wtc_gh_900t00`

### cert-wtc-az204-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: AZ-204T00 training certificate by WTC.
- `supports`:
  - `vault_doc`: `wtc_az_204t00`

## Activities

### act-kp-volunteering-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Completed 95 hours of volunteer work at Asociación KP across 2022–2023 (Lima Metropolitana).
- `supports`:
  - `vault_doc`: `kp_volunteering_2022_75h`
  - `vault_doc`: `kp_volunteering_2023_20h`

### act-datafest-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: 2nd place at DataFest (Universidad ESAN + BCP), held Oct 17–18, 2025.
- `supports`:
  - `vault_doc`: `datafest_2025_second_place`

### act-sala-001
- `surface`: `both`
- `publicable`: `yes`
- `claim`: Participated in Summit of AI in Latam (SALA), held Mar 9–12, 2026 at Universidad San Francisco de Quito; received a full grant.
- `supports`:
  - `vault_doc`: `sala_2026_participation`
