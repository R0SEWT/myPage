// === DATOS DEL SITIO === //
export const SITE_CONFIG = {
  name: 'Rody Vilchez',
  tagline: 'Applied ML Engineer',
  description:
    'Applied ML Engineer especializado en RAG systems, document intelligence y data pipelines. Diseño de sistemas de ML bajo restricciones reales: API limits, datos ruidosos y formatos heterogéneos.',
  url: 'https://rosewt.dev',
  author: 'Rody Sebastián Vilchez Marín',
  email: 'rody.vilchez00@gmail.com',
  location: 'Lima, Perú',
  github: 'https://github.com/R0SEWT',
  linkedin: 'https://www.linkedin.com/in/r0sewt/',
  cv: '/CV.pdf',
} as const;

// === TECNOLOGÍAS PRINCIPALES === //
export const MAIN_TECHNOLOGIES = [
  { text: 'RAG Systems', variant: 'primary' as const, animated: true },
  { text: 'Document Intelligence', variant: 'secondary' as const, animated: true },
  { text: 'PyTorch', animated: true },
  { text: 'FastAPI', animated: true },
  { text: 'LlamaIndex', animated: true },
  { text: 'Vector Search', animated: true },
] as const;

// === EXPERIENCIA === //
export const EXPERIENCE = [
  {
    title: 'AI / Data Intern',
    company: 'International Potato Center (CIP, CGIAR)',
    period: '2026–Presente',
    responsibilities: [
      'Pipelines de procesamiento de documentos: ingesta → parsing → chunking → embedding → vector storage para corpora multilingües.',
      'Sistemas RAG para QA sobre documentos de investigación agrícola con manejo de OCR ruidoso y estructuras inconsistentes.',
      'Integración Qdrant + MongoDB para retrieval híbrido balanceando recall vs. latencia.',
    ],
  },
  {
    title: 'QA Engineer Intern',
    company: 'Visma LATAM',
    period: '2024–2025',
    responsibilities: [
      'Suites de regresión automatizadas con Cypress + Jenkins CI/CD.',
      'Generadores de tests DOM-aware extrayendo selectores y estado de aplicaciones en vivo.',
      'Workflows de validación de datos con fixtures para consistencia pre-deployment.',
    ],
  },
] as const;

// === PUBLICACIONES === //
export const PUBLICATIONS = [
  {
    title: 'Imitator — Multimodal Sign Language Translation',
    description: 'Forthcoming in Springer CCIS (2026) — aceptado, pendiente de publicación',
    link: '#',
  },
] as const;

// === PROYECTOS DESTACADOS EN HERO === //
export const FEATURED_PROJECTS = [
  {
    label: 'RAG',
    title: 'Ask-Papa AI',
    description: 'Document intelligence · Qdrant · FastAPI',
    ariaLabel: 'Sistema Ask-Papa AI',
  },
  {
    label: 'Legal RAG',
    title: 'ArbitrIA',
    description: 'LlamaIndex · retrieval semántico',
    ariaLabel: 'Sistema ArbitrIA',
  },
  {
    label: 'Vision',
    title: 'NAO Emotion Detection',
    description: 'PyTorch · Flask · sub-120ms pipeline',
    ariaLabel: 'Sistema NAO Emotion Detection',
  },
  {
    label: 'Research',
    title: 'Imitator (SLT)',
    description: 'ST-GCN + Transformer · Springer CCIS',
    ariaLabel: 'Paper Imitator',
  },
] as const;

// === NAVEGACIÓN === //
export const NAVIGATION_LINKS = [
  { href: '#projects', label: 'Sistemas' },
  { href: '#experience', label: 'Experiencia' },
  { href: '#publications', label: 'Investigación' },
  { href: '#contact', label: 'Contacto' },
] as const;

// === BADGES DE CONTACTO === //
export const CONTACT_BADGES = [
  { text: 'Respuesta < 48h', variant: 'primary' as const },
  { text: 'Abierto a roles Data/ML', variant: 'secondary' as const },
  { text: 'Disponible para colaboraciones', animated: true },
] as const;
