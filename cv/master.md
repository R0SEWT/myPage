# Identity

Name: Rody Vilchez Marín  
Location: Lima, Peru  
Email: rody.vilchez00@gmail.com  
Phone: +51 987 082 126

Links:
- Portfolio: https://rosewt.dev  
- GitHub: https://github.com/R0SEWT  
- LinkedIn: https://www.linkedin.com/in/r0sewt/  

---

# Headline

Applied ML Engineer — RAG Systems · Document Intelligence · Data Pipelines

---

# Summary

Computer Science undergraduate building production-oriented ML systems under real-world constraints — API rate limits, noisy multilingual documents, heterogeneous data formats, and limited compute budgets. Currently designing RAG pipelines, document intelligence workflows, and data processing systems at the International Potato Center (CIP, CGIAR). Prior work spans legal-domain retrieval, multimodal sign language translation, and vision-based robotics for clinical settings, with consistent emphasis on system architecture, engineering tradeoffs, and deployment viability.

---

# Experience

## AI / Data Intern — International Potato Center (CIP, CGIAR)
Lima, Peru | Apr 2026 – Present

- Designed end-to-end document processing pipelines (ingestion → parsing → chunking → embedding → vector storage) for agricultural research corpora spanning multiple languages and formats
- Built retrieval-augmented generation systems for domain-specific question answering, handling noisy OCR output and inconsistent document structures
- Implemented metadata enrichment workflows using LLMs with batching and failure recovery to handle API rate limits and partial data availability
- Integrated Qdrant vector search with MongoDB for hybrid retrieval, balancing recall against latency constraints
- Engineered structured evaluation pipelines for retrieval quality under real-world data conditions

---

## QA Engineer Intern — Visma LATAM
Lima, Peru | Dec 2024 – Mar 2025

- Developed automated regression suites with Cypress integrated into Jenkins CI/CD, reducing manual validation cycles
- Designed data validation workflows using fixture-based test data to ensure consistency across systems prior to deployment
- Built DOM-aware test generators that extracted selectors and state from live applications to accelerate test authoring
- Collaborated with engineering to debug system-level issues using structured, reproducible test scenarios

---

# Selected Systems

## ArbitrIA — Legal RAG System
LlamaIndex · FastAPI · OpenAI · PostgreSQL · Docker

- Built a domain-specific RAG system for querying Peruvian arbitration documents, supporting contextual question answering over complex legal texts
- Designed semantic retrieval pipelines with document-level and chunk-level indexing strategies to balance recall and answer relevance
- Implemented an ingestion service handling PDFs with variable structure: multi-column layouts, embedded tables, and inconsistent section headers
- Developed a conversational interface that maintained query context across turns, resolving ambiguous references against the document corpus

---

## NAO Emotion Detection — Vision & Robotics System
PyTorch · Flask · OpenCV · MediaPipe · Optuna

- Designed an emotion recognition system for the NAO robot targeting psychoeducational intervention for children with ASD (Autism Spectrum Disorder)
- Compared three CNN architectures (MobileNetV2, VGG19, custom) under hardware constraints — selected MobileNetV2 for its accuracy/latency tradeoff (89% accuracy, 15ms inference)
- Built an end-to-end inference pipeline: NAO camera capture → base64 HTTP transmission → Flask API → model inference → adaptive robot response, with <120ms total latency
- Optimized hyperparameters across 150+ Optuna trials with multi-objective search (accuracy vs. inference time) and median pruning
- Validated in controlled FabLab sessions with 15 participants, achieving 91% correct detection rate under real lighting conditions

---

## Danish Housing — Large-Scale Data Pipeline & Predictive Modeling
H2O AutoML · XGBoost · Optuna · SHAP · LIME

- Engineered a data processing pipeline for 1.5M residential transaction records (1992–2024) with heterogeneous feature types, missing values, and temporal drift
- Designed feature engineering strategies addressing geographic encoding, temporal seasonality, and property-type interactions
- Benchmarked XGBoost with Optuna tuning against H2O AutoML, analyzing performance-interpretability tradeoffs across model families
- Implemented interpretability analysis using SHAP and LIME to validate model decisions against known market dynamics and detect data leakage

---

# Research

## Imitator — Multimodal Sign Language Translation
Forthcoming in Springer CCIS (2026) — accepted, pending publication

- Designed a multimodal architecture aligning ST-GCN visual keypoint sequences with LLM-derived text embeddings via cross-attention
- Mapped variable-length video inputs into structured embedding spaces without requiring intermediate gloss annotations
- Achieved stable embedding alignment (MSE + cosine similarity ≈ 8e-4) across validation, demonstrating viability of gloss-free translation
- Proposed a lightweight alternative to conventional sign language translation pipelines, reducing annotation dependency

---

# Education

## B.Sc. Computer Science
Universidad Peruana de Ciencias Aplicadas (UPC)  
8th semester  
Expected graduation: 2026-2

---

# Skills

## ML & AI
PyTorch, scikit-learn, H2O.ai, Optuna, SHAP, LIME

## RAG & Retrieval
LlamaIndex, embeddings, vector search (Qdrant), document processing

## Data & Pipelines
Pandas, feature engineering, ETL design, large-scale data processing

## Backend & Systems
FastAPI, Flask, REST APIs, MongoDB, PostgreSQL

## Infrastructure
Docker, Git, CI/CD (Jenkins), Linux

## Languages
Spanish (native), English (advanced)

---

# Certifications

- AI Engineer for Data Scientists Associate — DataCamp
- Machine Learning Specialization — Google Cloud Skills Boost
- Professional Data Analytics Certificate — Google
- Python for Everybody — University of Michigan

---

# Technical Interests

- Retrieval-augmented generation and document intelligence
- Representation learning and embedding alignment
- Data-centric AI and pipeline engineering
- Production ML systems under real-world constraints
