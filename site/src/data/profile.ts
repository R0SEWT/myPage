export const PROFILE = {
  name: 'Rody Vilchez',
  headline: 'Applied ML Engineer',
  role: 'RAG · Document Intelligence · Data Pipelines',
  summary:
    'I design applied AI systems for non-ideal conditions: retrieval, document intelligence, and data pipelines over noisy multilingual corpora. Currently at the International Potato Center (CIP, CGIAR), building document processing and question answering workflows for agricultural research.',
  availability: 'Open to Applied ML roles · Lima / remote',
  email: 'rody.vilchez00@gmail.com',
  links: {
    github: 'https://github.com/R0SEWT',
    linkedin: 'https://www.linkedin.com/in/r0sewt/',
    cvEn: '/CV.en.pdf',
    cvEs: '/CV.es.pdf',
  },
};

export const QUICK_FACTS = [
  { label: 'Now', value: 'AI / Data Intern — CIP (CGIAR), Lima' },
  { label: 'Focus', value: 'RAG · Document Intelligence · Data Pipelines' },
  { label: 'Publication', value: 'Imitator — Springer CCIS (2026, accepted)' },
  { label: 'Education', value: 'B.Sc. Computer Science, UPC — expected 2026-2' },
];

export interface Job { company: string; role: string; period: string; location: string; bullets: string[] }

export const EXPERIENCE: Job[] = [
  {
    company: 'International Potato Center (CIP, CGIAR)',
    role: 'AI / Data Intern',
    period: 'Oct 2025 – Present',
    location: 'Lima, Peru',
    bullets: [
      'Designed document processing pipelines for an internal GraphRAG workflow over multilingual corpora (Spanish, English, French, Portuguese, Chinese) with noisy OCR, irregular layout, and partial classification, covering ingestion, parsing, chunking, embedding, and vector storage',
      'Implemented LLM-based structured metadata enrichment with schema validation, batching, and rate-limit backoff to improve retrieval quality over heterogeneous documents',
      'Co-built an IT support agent in Copilot Studio deployed in Teams, covering level-0 resolution over internal technical documentation and escalation to ticketing',
    ],
  },
  {
    company: 'Visma LATAM',
    role: 'QA Trainee',
    period: 'Dec 2024 – Oct 2025',
    location: 'Lima, Peru',
    bullets: [
      'Built an LLM-based agent that generates automated end-to-end tests from specifications, reducing manual effort in creating and maintaining regression suites',
      'Developed Cypress regression suites integrated into Jenkins for critical flows that had to remain stable across successive integrations',
      'Built DOM-aware test generators that extracted selectors and runtime state from live applications, improving test maintainability under UI changes',
    ],
  },
];

export interface ResearchItem { title: string; venue: string; summary: string; links: { github?: string } }

export const RESEARCH: ResearchItem[] = [
  {
    title: 'Imitator — Multimodal Sign Language Translation',
    venue: 'WAILAMP 2025 · SIMBIG 2025 · Springer CCIS (2026, accepted)',
    summary:
      'Reformulated sign language translation as alignment in an LLM latent space, avoiding gloss as an intermediate representation. Latent queries + cross-attention project keypoint sequences into token-aligned embeddings; stable alignment (MSE + cosine similarity ≈ 8×10⁻⁴) without retraining the LLM.',
    links: { github: 'https://github.com/nakato156/Multimodal-Sign-Language-Model' },
  },
  {
    title: 'GENO-MAP — Correspondence-Free Diagnostics for High-Dimensional Data',
    venue: 'Poster — SALA 2026',
    summary:
      'Validation framework based on kNN graph invariants: neighborhood structure remains robust under severe perturbation with continuous degradation and no phase transitions; PCA preserves structural stability better than autoencoders.',
    links: { github: 'https://github.com/R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps' },
  },
  {
    title: 'B.Sc. thesis (in progress) — Graph signals for public-works procurement risk',
    venue: 'UPC, 2026',
    summary:
      'Graph ML over public procurement networks with temporal validation. Claims held until the thesis closes.',
    links: {},
  },
];

export const SKILLS: { group: string; items: string }[] = [
  { group: 'ML / AI Systems', items: 'PyTorch, scikit-learn, Optuna, model evaluation, multimodal pipelines' },
  { group: 'Retrieval / Document AI', items: 'Embeddings, Qdrant, LlamaIndex, chunking, parsing, document processing' },
  { group: 'Data / Backend', items: 'Pandas, FastAPI, Flask, REST APIs, MongoDB, PostgreSQL, ETL' },
  { group: 'Infrastructure', items: 'Docker, Git, Linux, Jenkins, CI/CD' },
];

export const CERTIFICATIONS = [
  'Developing Solutions for Microsoft Azure (AZ-204T00) — WTC (2026)',
  'GitHub Foundations (GH-900T00) — WTC (2026)',
  'AI Engineer for Data Scientists — DataCamp (2025)',
  'Machine Learning Specialization — Google Cloud (2025)',
  'Google Data Analytics — Google (2024)',
  'Human-Centered AI — Tecnológico de Monterrey (2022)',
];

export const ACTIVITIES = [
  'DataFest — BCP x ESAN, 2nd place (2025)',
  'SALA 2026 — Summit of AI in LatAm, full grant recipient',
  'Asociación KP — Volunteering, 95 hours (2022–2023)',
];
