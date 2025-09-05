// === DATOS DEL SITIO === //
export const SITE_CONFIG = {
  name: "Rody Vilchez",
  tagline: "Data Scientist & ML Engineer",
  description: "Estudiante de Computer Science especializado en Machine Learning, RAG, Computer Vision y QA. Proyectos con PyTorch, H2O.ai, LlamaIndex y más.",
  url: "https://rosewt.dev",
  author: "Rody Sebastián Vilchez Marín",
  email: "rody.vilchez00@gmail.com",
  location: "Lima, Perú",
  github: "https://github.com/R0SEWT",
  linkedin: "https://www.linkedin.com/in/r0sewt/",
  cv: "/CV.pdf"
} as const;

// === TECNOLOGÍAS PRINCIPALES === //
export const MAIN_TECHNOLOGIES = [
  { text: "Python", animated: true },
  { text: "H2O.ai", animated: true },
  { text: "XGBoost", animated: true },
  { text: "Optuna", animated: true },
  { text: "RAG", variant: "primary" as const, animated: true },
  { text: "CV", variant: "secondary" as const, animated: true }
] as const;

// === EXPERIENCIA === //
export const EXPERIENCE = [
  {
    title: "QA Trainee",
    company: "Visma LATAM (Mandü)",
    period: "2024–2025",
    responsibilities: [
      "Automatización de pruebas con Cypress; generación de suites a partir del DOM.",
      "Gestión de datos/selectores vía fixtures JSON; reporte de bugs en Jira.",
      "Integración con Jenkins; métricas y coverage en flujos críticos."
    ]
  },
  {
    title: "Proyectos Académicos",
    company: "UPC",
    period: "2023–2025",
    responsibilities: [
      "Reconocimiento de emociones con NAO: CNNs + keypoints faciales/posturales.",
      "RAG legal (ArbitrIA): ingestion service + LlamaIndex + chat contextual.",
      "Big Data (H2O): modelo de precios de vivienda en Dinamarca con SHAP/LIME."
    ]
  }
] as const;

// === PUBLICACIONES === //
export const PUBLICATIONS = [
  {
    title: "Imitator: Gloss‑Free SLT via Embedding Alignment",
    description: "Borrador IEEE — 2025",
    link: "#"
  },
  {
    title: "Danish Housing Prices — EDA + ML",
    description: "Reporte técnico — 2025",
    link: "#"
  }
] as const;

// === PROYECTOS DESTACADOS EN HERO === //
export const FEATURED_PROJECTS = [
  {
    label: "Proyecto",
    title: "Imitator (SLT)",
    description: "ST-GCN + Transformer · Offline",
    ariaLabel: "Proyecto Imitator"
  },
  {
    label: "EDA",
    title: "Danish Housing Prices",
    description: "H2O + SHAP/LIME · 1.5M rows",
    ariaLabel: "Análisis Housing Prices"
  },
  {
    label: "RAG",
    title: "ArbitrIA",
    description: "Legal-tech · LlamaIndex",
    ariaLabel: "Proyecto ArbitrIA"
  },
  {
    label: "QA",
    title: "Cypress + Jenkins",
    description: "Mapping & auto-tests",
    ariaLabel: "Automatización QA"
  }
] as const;

// === NAVEGACIÓN === //
export const NAVIGATION_LINKS = [
  { href: "#projects", label: "Proyectos" },
  { href: "#experience", label: "Experiencia" },
  { href: "#publications", label: "Publicaciones" },
  { href: "#contact", label: "Contacto" }
] as const;

// === BADGES DE CONTACTO === //
export const CONTACT_BADGES = [
  { text: "📧 Respuesta < 48h", variant: "primary" as const },
  { text: "💼 Abierto a colaboraciones", variant: "secondary" as const },
  { text: "🚀 Disponible para proyectos", animated: true }
] as const;
