// Source of truth: cv/master.md

export const SITE_CONFIG = {
  name: 'Rody Vilchez',
  headline: 'Applied ML Engineer',
  subheadline: 'RAG Systems · Document Intelligence · Data Pipelines',
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

export type SpecimenStatus = 'Publicado' | 'Restringido' | 'Demo activa' | 'Archivado';

export interface Specimen {
  code: string;
  yearRange: string;
  domain: string;
  status: SpecimenStatus;
  title: string;
  subtitle: string;
  summary: string;
  tags: Tag[];
  venue: string;
  stack: string;
  metric: string;
  url?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResearchMetric {
  val: string;
  label: string;
}

export interface ResearchEntry {
  title: string;
  titleEm?: string;
  venue: string;
  year: number;
  status: string;
  url: string;
  bullets: string[];
  metrics: ResearchMetric[];
}

export const SPECIMENS: Specimen[] = [
  {
    code: 'SYS·001',
    yearRange: '2025 — 2026',
    domain: 'Sistemas',
    status: 'Publicado',
    title: 'GENO-MAP',
    subtitle: 'Diagnóstico libre de correspondencia para mapas de diversidad',
    summary:
      'Framework de validación basado en invariantes de grafos kNN para evaluar estructura de vecindades en representaciones de alta dimensión. Demostré que la estructura de vecindades permanece robusta bajo perturbaciones severas, con degradación continua y sin transiciones de fase.',
    tags: [
      { label: 'PCA', variant: 'default' },
      { label: 'UMAP', variant: 'default' },
      { label: 'kNN Graphs', variant: 'default' },
      { label: 'Sweet Potato', variant: 'default' },
    ],
    venue: 'SALA 2026 · Poster',
    stack: 'Python · scikit-learn',
    metric: 'kNN invariant · no phase transition',
    url: 'https://github.com/R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps',
  },
  {
    code: 'SYS·002',
    yearRange: '2024 — 2025',
    domain: 'Retrieval',
    status: 'Restringido',
    title: 'ArbitrIA',
    subtitle: 'Sistema de recuperación legal para arbitraje peruano',
    summary:
      'Sistema de recuperación combinando indexación a nivel documento y a nivel chunk para mejorar precisión en consultas complejas. Pipelines robustos sobre PDFs heterogéneos con layouts multicolumna, tablas embebidas y encabezados inconsistentes.',
    tags: [
      { label: 'LlamaIndex', variant: 'default' },
      { label: 'FastAPI', variant: 'default' },
      { label: 'PostgreSQL', variant: 'default' },
      { label: 'Docker', variant: 'default' },
    ],
    venue: 'Interno · propietario',
    stack: 'LlamaIndex · FastAPI',
    metric: 'Doc + chunk retrieval',
  },
  {
    code: 'SYS·003',
    yearRange: '2024',
    domain: 'Investigación',
    status: 'Demo activa',
    title: 'Gallstone Risk',
    subtitle: 'ML para tamizaje en entornos de recursos limitados',
    summary:
      'Reformulé predicción de cálculos biliares como sistema de decisión bajo restricciones de observabilidad, removiendo dependencia de variables clínicas no disponibles en campo. Evalué el trade-off rendimiento↔viabilidad operativa.',
    tags: [
      { label: 'XGBoost', variant: 'default' },
      { label: 'SHAP', variant: 'default' },
      { label: 'Optuna', variant: 'default' },
      { label: 'Rural Peru', variant: 'default' },
    ],
    venue: 'gallstone.rosewt.dev',
    stack: 'XGBoost · SHAP',
    metric: 'AUC conservado · menos features',
    url: 'https://gallstone.rosewt.dev/',
  },
  {
    code: 'SYS·004',
    yearRange: '2024 — 2025',
    domain: 'Investigación',
    status: 'Publicado',
    title: 'Imitator',
    subtitle: 'Traducción multimodal de lengua de señas',
    summary:
      'Reformulación de la traducción de señas como alineamiento en el espacio latente de un LLM, evitando gloss como representación intermedia. Latent queries + cross-attention que proyecta keypoints en embeddings alineados con tokens.',
    tags: [
      { label: 'PyTorch', variant: 'default' },
      { label: 'Transformer', variant: 'default' },
      { label: 'WAILAMP 2025', variant: 'active' },
      { label: 'Springer CCIS', variant: 'ok' },
    ],
    venue: 'WAILAMP 2025 · SIMBIG 2025',
    stack: 'PyTorch · Transformer',
    metric: '8×10⁻⁴ MSE',
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

export const STACK_RAIL: string[] = [
  'LlamaIndex',
  'FastAPI',
  'PyTorch',
  'PostgreSQL',
  'Docker',
  'XGBoost',
];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    label: 'ML / AI Systems',
    items: ['PyTorch', 'scikit-learn', 'Optuna', 'model evaluation', 'multimodal pipelines'],
  },
  {
    label: 'Retrieval / Document AI',
    items: ['Embeddings', 'Qdrant', 'LlamaIndex', 'chunking', 'parsing', 'document processing'],
  },
  {
    label: 'Data / Backend',
    items: ['Pandas', 'FastAPI', 'Flask', 'REST APIs', 'MongoDB', 'PostgreSQL', 'ETL'],
  },
  {
    label: 'Infrastructure',
    items: ['Docker', 'Git', 'Linux', 'Jenkins', 'CI/CD'],
  },
];

export interface EducationEntry {
  institution: string;
  degree: string;
  expected: string;
}

export const EDUCATION: EducationEntry[] = [
  {
    institution: 'Universidad Peruana de Ciencias Aplicadas (UPC)',
    degree: 'B.Sc. Computer Science',
    expected: 'Esperada 2026-2',
  },
];

export interface Certification {
  label: string;
  issuer: string;
  year: string;
}

export const CERTIFICATIONS: Certification[] = [
  { label: 'AZ-204T00 · Developing Solutions for Microsoft Azure', issuer: 'WTC', year: '2026' },
  { label: 'GH-900T00 · GitHub Foundations', issuer: 'WTC', year: '2026' },
  { label: 'AI Engineer for Data Scientists', issuer: 'DataCamp', year: '2025' },
  { label: 'Machine Learning Specialization', issuer: 'Google Cloud', year: '2025' },
  { label: 'Google Data Analytics', issuer: 'Google', year: '2024' },
];

export interface Activity {
  label: string;
  detail: string;
  year: string;
}

export const ACTIVITIES: Activity[] = [
  { label: '2º lugar · DataFest', detail: 'BCP × ESAN', year: '2025' },
  { label: 'Full grant · SALA', detail: 'Summit of AI in LatAm', year: '2026' },
];

export const RESEARCH: ResearchEntry[] = [
  {
    title: 'Imitator — ',
    titleEm: 'traducción de lengua de señas multimodal',
    venue: 'Presentado en WAILAMP 2025 y SIMBIG 2025 · En Springer CCIS (2026), aceptado, pendiente de publicación',
    year: 2025,
    status: 'Forthcoming',
    url: 'https://github.com/nakato156/Multimodal-Sign-Language-Model',
    bullets: [
      'Reformulación de la traducción de lengua de señas como alineamiento en el espacio latente de un LLM, evitando gloss como representación intermedia.',
      'Arquitectura con latent queries y atención cruzada que proyecta secuencias de keypoints en embeddings alineados con tokens, desacoplando la longitud temporal de entrada de la longitud de salida.',
    ],
    metrics: [
      { val: '8×10⁻⁴', label: 'MSE + cosine · alineamiento' },
      { val: '0', label: 'retraining del LLM base' },
      { val: '2', label: 'conferencias · CCIS próx.' },
    ],
  },
];
