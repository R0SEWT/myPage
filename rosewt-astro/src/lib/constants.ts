// === DATOS DEL SITIO === //
export const SITE_CONFIG = {
  name: 'Rody Vilchez',
  tagline: 'Applied ML Engineer',
  description:
    'Applied ML Engineer especializado en retrieval, document intelligence y evaluación de sistemas bajo restricciones reales: datos ruidosos, corpus multilingües y formatos heterogéneos.',
  url: 'https://rosewt.dev',
  author: 'Rody Sebastián Vilchez Marín',
  email: 'rody.vilchez00@gmail.com',
  location: 'Lima, Perú',
  github: 'https://github.com/R0SEWT',
  linkedin: 'https://www.linkedin.com/in/r0sewt/',
  cvEn: '/CV.en.pdf',
  cvEs: '/CV.es.pdf',
} as const;

// === TECNOLOGÍAS PRINCIPALES === //
export const MAIN_TECHNOLOGIES = [
  { text: 'Retrieval', variant: 'primary' as const, animated: true },
  { text: 'Document Intelligence', variant: 'secondary' as const, animated: true },
  { text: 'Evaluation', animated: true },
  { text: 'PyTorch', animated: true },
  { text: 'FastAPI', animated: true },
  { text: 'Vector Search', animated: true },
] as const;

// === EXPERIENCIA === //
export const EXPERIENCE = [
  {
    title: 'AI / Data Intern',
    company: 'International Potato Center (CIP, CGIAR)',
    period: 'Oct 2025–Presente',
    responsibilities: [
      'Pipelines documentales para un GraphRAG interno sobre corpus multilingües con OCR ruidoso, layout irregular e ingesta, parsing, chunking, embedding y vector storage.',
      'Enriquecimiento de metadata con structured output basado en LLM, validación de esquema, batching y backoff frente a rate limits.',
      'Co-diseño de un agente de soporte TI en Copilot Studio desplegado en Teams para resolución nivel 0 sobre documentación técnica interna.',
      'Flujo de escalamiento a ticketing con prellenado estructurado desde el contexto conversacional y revisión human-in-the-loop vía Adaptive Cards.',
    ],
  },
  {
    title: 'QA Trainee',
    company: 'Visma LATAM',
    period: 'Dic 2024–Oct 2025',
    responsibilities: [
      'Agente basado en LLM que genera tests end-to-end a partir de especificaciones, reduciendo esfuerzo manual en creación y mantenimiento.',
      'Suites de regresión automatizadas con Cypress integradas en Jenkins para flujos críticos en integraciones sucesivas.',
      'Generadores de pruebas DOM-aware para extraer selectores y estado desde aplicaciones en ejecución.',
    ],
  },
] as const;

// === PUBLICACIONES === //
export const PUBLICATIONS = [
  {
    title: 'Imitator — Multimodal Sign Language Translation',
    description: 'Presentado en WAILAMP 2025 y SIMBIG 2025; forthcoming in Springer CCIS (2026) — aceptado, pendiente de publicación',
    link: 'https://github.com/nakato156/Multimodal-Sign-Language-Model',
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
