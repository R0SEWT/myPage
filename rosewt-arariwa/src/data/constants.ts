// Source of truth: cv/master.md

export const SITE_CONFIG = {
  name: 'Rody Vilchez',
  headline: 'Applied ML Engineer',
  subheadline: 'Retrieval · Document Intelligence · Evaluación y Robustez',
  summary:
    'Diseño sistemas de IA aplicados para condiciones no ideales: retrieval, document intelligence y pipelines sobre corpus multilingües ruidosos. Actualmente en CIP (CGIAR), construyendo workflows de procesamiento de documentos y question answering para investigación agrícola.',
  location: 'Lima, Perú',
  email: 'rody.vilchez00@gmail.com',
  github: 'https://github.com/R0SEWT',
  linkedin: 'https://www.linkedin.com/in/r0sewt/',
  cvEn: '/CV.en.pdf',
  cvEs: '/CV.es.pdf',
  domain: 'rosewt.dev',
} as const;

export type TagVariant = 'default' | 'active' | 'ok';

export interface Tag {
  label: string;
  variant?: TagVariant;
}

export interface Specimen {
  code: string;
  year: number;
  domain: string;
  status: 'Activo' | 'Archivado';
  seal: string;
  title: string;
  summary: string;
  tags: Tag[];
  provenance: string;
  url?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResearchEntry {
  title: string;
  venue: string;
  year: number;
  status: string;
  url: string;
  bullets: string[];
}

export const SPECIMENS: Specimen[] = [
  {
    code: 'ARV-2601',
    year: 2026,
    domain: 'Sistemas',
    status: 'Activo',
    seal: '/assets/seal-systems.svg',
    title: 'GENO-MAP — Diagnóstico sin correspondencia para datos de alta dimensión',
    summary:
      'Framework de validación basado en invariantes de grafos kNN para evaluar estructura de vecindad en representaciones de alta dimensión. Presentado como póster en SALA 2026.',
    tags: [
      { label: 'PCA · UMAP · kNN', variant: 'default' },
      { label: 'SALA 2026', variant: 'active' },
      { label: 'publicado', variant: 'ok' },
    ],
    provenance: 'UPC · Lima, 2025–2026',
    url: 'https://github.com/R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps',
  },
  {
    code: 'ARV-2503',
    year: 2025,
    domain: 'Retrieval',
    status: 'Activo',
    seal: '/assets/seal-retrieval.svg',
    title: 'ArbitrIA — Sistema de Recuperación Legal [Restringido]',
    summary:
      'Sistema de retrieval sobre documentos de arbitraje peruano. Indexación dual (documento + chunk), pipelines robustos para PDFs heterogéneos, evaluación de estrategias de chunking.',
    tags: [
      { label: 'LlamaIndex · FastAPI', variant: 'default' },
      { label: 'PostgreSQL · Docker', variant: 'default' },
      { label: 'retrieval', variant: 'active' },
      { label: 'restringido', variant: 'default' },
    ],
    provenance: 'Lima, 2025',
  },
  {
    code: 'ARV-2407',
    year: 2024,
    domain: 'Investigación',
    status: 'Archivado',
    seal: '/assets/seal-research.svg',
    title: 'Gallstone Risk — ML para cribado bajo restricciones de recursos',
    summary:
      'Sistema de predicción de riesgo de cálculos biliares con degradación controlada bajo reducción de features clínicos. Diseñado para entornos rurales sin variables de laboratorio.',
    tags: [
      { label: 'XGBoost · SHAP · Optuna', variant: 'default' },
      { label: 'clínico', variant: 'default' },
      { label: 'demo', variant: 'ok' },
    ],
    provenance: 'UPC · Lima, 2024',
    url: 'https://gallstone.rosewt.dev/',
  },
  {
    code: 'ARV-2501',
    year: 2025,
    domain: 'Investigación',
    status: 'Archivado',
    seal: '/assets/seal-research.svg',
    title: 'Imitator — Traducción Multimodal de Lengua de Señas',
    summary:
      'Reformulación de la traducción de señas como alineación en el espacio latente de un LLM. Latent queries + cross-attention, sin glosa intermedia. WAILAMP 2025 · SIMBIG 2025.',
    tags: [
      { label: 'PyTorch · Transformer', variant: 'default' },
      { label: 'WAILAMP 2025', variant: 'active' },
      { label: 'Springer CCIS', variant: 'ok' },
    ],
    provenance: 'UPC · Lima, 2024–2025',
    url: 'https://github.com/nakato156/Multimodal-Sign-Language-Model',
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'International Potato Center (CIP, CGIAR)',
    role: 'AI / Data Intern',
    period: 'Oct 2025 – Presente',
    location: 'Lima, Perú',
    bullets: [
      'Diseñó pipelines de procesamiento de documentos para un workflow GraphRAG interno sobre corpus multilingüe (ES, EN, FR, PT, ZH) con OCR ruidoso, layout irregular y clasificación parcial.',
      'Implementó enriquecimiento estructurado de metadatos con LLMs: validación de esquema, batching y manejo de rate-limit para mejorar la calidad de retrieval.',
      'Co-construyó un agente de soporte IT en Copilot Studio desplegado en Teams, con resolución nivel-0 y escalamiento a ticketing.',
      'Diseñó el flujo de escalamiento: pre-llenado del ticket desde contexto conversacional con revisión human-in-the-loop vía Adaptive Cards.',
    ],
  },
  {
    company: 'Visma LATAM',
    role: 'QA Trainee',
    period: 'Dic 2024 – Oct 2025',
    location: 'Lima, Perú',
    bullets: [
      'Construyó un agente LLM que genera tests end-to-end automatizados desde especificaciones, reduciendo el esfuerzo manual en suites de regresión.',
      'Desarrolló suites Cypress en Jenkins para flujos críticos que debían permanecer estables entre integraciones sucesivas.',
      'Construyó generadores de tests DOM-aware que extraían selectores y estado en runtime desde aplicaciones en vivo.',
    ],
  },
];

export const RESEARCH: ResearchEntry[] = [
  {
    title: 'Imitator — Multimodal Sign Language Translation',
    venue: 'WAILAMP 2025 · SIMBIG 2025 · Springer CCIS (2026, aceptado)',
    year: 2025,
    status: 'Forthcoming',
    url: 'https://github.com/nakato156/Multimodal-Sign-Language-Model',
    bullets: [
      'Reformuló la traducción de lengua de señas como alineación en el espacio latente de un LLM, evitando la glosa como representación intermedia.',
      'Arquitectura con latent queries y cross-attention que proyecta secuencias de keypoints en embeddings alineados con tokens.',
      'Alineación estable (MSE + similitud coseno ≈ 8×10⁻⁴) sin reentrenar el LLM.',
    ],
  },
];
