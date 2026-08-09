/**
 * Content for the Vesper deck (home) — v3.
 *
 * Bilingual strings are `Bi`; both variants are rendered into the DOM and CSS
 * shows one of them based on `data-lang` on <html>, so the language toggle
 * costs one attribute write and no re-render.
 *
 * Some copy in the design source is authored in English only (the system and
 * research write-ups, the contribution summaries). Those stay plain strings
 * rather than being machine-translated into a `Bi` — see agents.md on
 * editorial provenance.
 *
 * Strings may contain inline markup (<br>, <span class="hl">) — they are
 * authored here, not user input, and are injected with set:html.
 */

export interface Bi {
  es: string;
  en: string;
}

export interface Screen {
  num: string;
  label: Bi;
  /**
   * Section heading, when it should read longer than the nav label. The nav
   * pill, the heading and the stats readout all draw on `label`, and the pill
   * works to a shared width budget across six items — so a heading that wants
   * more words gets its own string rather than widening the nav.
   */
  heading?: Bi;
  /**
   * How the particle field is composed behind this screen. These belong to the
   * section, not to its position: the copy on each screen was written against a
   * particular formation, brightness and cloud placement, so reordering the
   * narrative must not reshuffle the visuals underneath it.
   *
   * `shape` indexes the formation table in scripts/field.ts (0 sphere shell ·
   * 1 spiral galaxy · 2 two lobes · 3 torus · 4 double helix · 5 lattice cube ·
   * 6 ring with core). `offset` slides the cloud right so copy sits on unlit
   * background; `dim` is the alpha multiplier for text-dense screens.
   */
  field: { shape: number; offset: number; dim: number };
}

/** Text-dense screens: cloud pushed aside, field pulled back behind the copy. */
const DENSE = { offset: 1.42, dim: 0.42 };

/**
 * Screen order drives the nav and the SYS.NN readout — the ordinals follow
 * position. Visual direction travels with the section via `field`.
 *
 * The narrative runs promise → applied evidence → scientific evidence →
 * external validation → track record → philosophy → contact: Approach sits
 * late so it reads as a synthesis earned by the evidence before it, rather
 * than as a claim staked ahead of it.
 */
export const SCREENS: Screen[] = [
  { num: '00', label: { es: 'Home', en: 'Home' }, field: { shape: 0, offset: 0, dim: 1 } },
  { num: '01', label: { es: 'Sistemas', en: 'Systems' }, field: { shape: 5, ...DENSE } },
  { num: '02', label: { es: 'Investigación', en: 'Research' }, field: { shape: 4, ...DENSE } },
  {
    num: '03',
    label: { es: 'Open Source', en: 'Open Source' },
    heading: { es: 'Contribuciones Open Source', en: 'Contributions Open Source' },
    field: { shape: 1, ...DENSE },
  },
  { num: '04', label: { es: 'Trayectoria', en: 'Career' }, field: { shape: 3, ...DENSE } },
  {
    num: '05',
    label: { es: 'Enfoque', en: 'Approach' },
    // Two lobes — one thing gained, one thing given up — because that is what
    // the copy on this screen names. The sheet is the one inverted screen, so
    // it keeps the bright, near-centred cloud it was composed against.
    field: { shape: 2, offset: 0.08, dim: 1 },
  },
  { num: '06', label: { es: 'Contacto', en: 'Contact' }, field: { shape: 6, ...DENSE } },
];

/** Nav shows the first six; Contact is the outlined CTA. */
export const NAV_COUNT = 6;

export const CONTACT_INDEX = 6;

/**
 * Point counts for the particle field. `full` is the spectacle setting; `lite`
 * is what coarse-pointer and narrow devices get. Raising `full` makes the field
 * denser and brighter — past ~90k it starts to wash out body copy on the
 * text-dense screens, which is the knob to turn if legibility matters more.
 */
export const DENSITY = { full: 90000, lite: 28000 };

export const chrome = {
  callsign: 'R.VILCHEZ',
  bootSystem: `V—03 / FIELD.${Math.round(DENSITY.full / 1000)}K`,
  bootLabel: { es: 'Inicializando entorno', en: 'Initializing environment' },
  brand: 'Rody V.',
  contact: { es: 'Contacto', en: 'Contact' },
  status: { es: 'Disponible', en: 'Open to roles' },
  more: { es: 'Sigue', en: 'More' },
  stats: {
    particles: { es: 'Partículas vivas', en: 'Live particles' },
    /**
     * Deliberately not a frame counter. The field is machine-dependent, and a
     * stat bar that publishes 34 fps advertises a performance problem rather
     * than the fact that the scene is being drawn live. If the deploy is ever
     * shown to hold ~60 on representative hardware, `field.fps()` is still
     * there to wire back up.
     */
    render: 'Realtime',
    renderLabel: { es: 'Render WebGL', en: 'WebGL render' },
    place: 'UTC−5 · Perú',
  },
};

export const links = {
  email: 'rody@rosewt.dev',
  github: 'https://github.com/R0SEWT',
  linkedin: 'https://www.linkedin.com/in/r0sewt/',
  cvEs: '/CV.es.pdf',
  cvEn: '/CV.en.pdf',
};

/* ---------------------------------------------------------------- 00 home */

export const home = {
  wordLeft: { es: 'SISTEMAS', en: 'SYSTEMS' },
  wordRight: { es: 'REALES', en: 'IN USE' },
  blurb: {
    es: 'Construyo sistemas de machine learning para condiciones no ideales: datos incompletos, objetivos ambiguos y restricciones institucionales.',
    en: 'I build machine learning systems for non-ideal conditions: incomplete data, ambiguous objectives and institutional constraints.',
  },
  chips: [
    { es: 'Recuperación', en: 'Retrieval' },
    { es: 'Sistemas de agentes', en: 'Agent systems' },
    { es: 'Evaluación', en: 'Evaluation' },
    { es: 'ML urbano', en: 'Urban ML' },
  ],
  name: 'Rody Vilchez',
  role: 'Applied ML Engineer',
  org: 'AI Intern · CIP–CGIAR',
  /**
   * The hero's one CTA. Both editions are rendered and CSS picks by `data-lang`,
   * the same way `T` works — the language toggle writes one attribute and does
   * not re-render, so the href cannot be branched at build time.
   *
   * `file` becomes the `download` attribute: the label says DESCARGAR/DOWNLOAD
   * and the arrow points down, so this downloads rather than opening a tab.
   * Paths keep the exact casing of `public/` — Netlify serves case-sensitively.
   */
  cv: [
    { lang: 'es', href: links.cvEs, file: 'Rody-Vilchez-CV-es.pdf', label: 'Descargar CV' },
    { lang: 'en', href: links.cvEn, file: 'Rody-Vilchez-CV-en.pdf', label: 'Download CV' },
  ],
};

/* ------------------------------------------------------------- 01 systems */

export const systems = {
  lead: {
    eyebrow: { es: 'Sistema en producción · CIP–CGIAR', en: 'Production system · CIP–CGIAR' },
    title: {
      es: 'CIP — Sistema institucional de agentes de IA',
      en: 'CIP — Institutional AI Agent System',
    },
    lede: {
      es: 'Diseñé e implementé un sistema multiagente en producción para soporte TI institucional.',
      en: 'Designed and implemented a production multi-agent system for institutional IT support.',
    },
    note: {
      es: 'Respaldado por una plataforma de evaluación basada en datos para regresión, calidad de respuesta y pruebas de comportamiento agéntico.',
      en: 'Backed by a data-grounded evaluation platform spanning regression, response quality and agentic testing.',
    },
  },
  prototype: {
    eyebrow: { es: 'Prototipo funcional · El Comercio', en: 'Working prototype · El Comercio' },
    title: {
      es: 'Wachi — Ruteo peatonal sensible al riesgo',
      en: 'Wachi — Risk-Aware Pedestrian Routing',
    },
    desc: {
      es: 'Diseñé y construí un prototipo geoespacial que reordena rutas peatonales por distancia y exposición estimada, derivada de patrones espaciotemporales en incidentes reportados.',
      en: 'Designed and built a geospatial prototype that re-ranks pedestrian routes by distance and estimated exposure derived from spatiotemporal patterns in reported incidents.',
    },
    meta: {
      es: 'H3 · Decaimiento temporal · Reordenamiento post hoc de rutas',
      en: 'H3 · Temporal decay · Post-hoc route reranking',
    },
    video: '/assets/deck/wachi-loop.webm',
    videoLabel: {
      es: 'Loop del reordenamiento de rutas peatonales de Wachi',
      en: 'Wachi pedestrian route reranking loop',
    },
    caption: { es: 'Captura del prototipo', en: 'Prototype capture' },
  },
};

/* ------------------------------------------------------------ 02 research */

export const research = {
  program: {
    eyebrow: {
      es: 'Investigación de tesis · UPC · 2025–2026',
      en: 'BSc thesis research · UPC · 2025–2026',
    },
    title: {
      es: 'Infelix — Riesgo delictivo latente bajo sesgo de medición',
      en: 'Infelix — Latent Crime Risk under Measurement Bias',
    },
    desc: {
      es: 'Investigo qué aprenden los sistemas de predicción delictiva cuando los registros están condicionados por quién denuncia, qué logra geocodificarse y en qué ciudad se entrenan.',
      en: 'Investigating what crime-prediction systems learn when the record itself is shaped by who reports, what gets geocoded, and which city you train on.',
    },
    /**
     * Anchors, not method hygiene. The line used to read "placebo-controlled ·
     * 20-seed robustness analysis", which tells a reviewer the work was careful
     * but tells a reader nothing about what it is. These three come verbatim
     * from the CV, so the two surfaces state the same facts.
     */
    meta: {
      es: '43 distritos de Lima–Callao · Panel H3 de 11 fuentes · Transferencia a 3 ciudades',
      en: '43 districts across Lima–Callao · H3 panel of 11 sources · Transfer to 3 cities',
    },
  },
  publication: {
    eyebrow: {
      es: 'Investigación publicada · Springer CCIS 2895 · 2026',
      en: 'Published research · Springer CCIS 2895 · 2026',
    },
    title: {
      es: 'Imitator — Modelo multimodal para lenguas de señas',
      en: 'Imitator — Multimodal Sign Language Model',
    },
    desc: {
      es: 'Coautor de una arquitectura multimodal sin glosas que alinea secuencias de keypoints 2D con embeddings de modelos de lenguaje preentrenados, evaluada en corpus de lenguas de señas peruana y argentina.',
      en: 'Co-authored a gloss-free multimodal architecture aligning 2D keypoint sequences with pretrained language-model embeddings across Peruvian and Argentinian sign-language datasets.',
    },
    doi: 'https://doi.org/10.1007/978-3-032-20322-9_23',
    /** An identifier, not copy — the same in both languages. */
    doiLabel: 'DOI 10.1007/978-3-032-20322-9_23 ↗',
    cover: '/assets/deck/imitator-ccis-2895.png',
    coverAlt: {
      es: 'Information Management and Big Data — actas de SIMBig 2025, volumen Springer CCIS 2895',
      en: 'Information Management and Big Data — SIMBig 2025 proceedings, Springer CCIS volume 2895',
    },
  },
};

/* --------------------------------------------------------- 03 open source */

export interface OpenSourceRow {
  mark: string;
  /** Project marks carry their own name; the same alt serves both languages. */
  markAlt: string;
  /** beads ships a square app mark; the others are transparent wordmarks. */
  rounded?: boolean;
  name: string;
  desc: Bi;
  contribution: Bi;
  /** A row becomes an anchor once an approved evidence URL exists for it. */
  href?: string;
}

export const openSource: OpenSourceRow[] = [
  {
    mark: '/assets/deck/os-copilot-studio.png',
    markAlt: 'Microsoft Copilot Studio',
    name: 'Microsoft Copilot Studio',
    desc: {
      es: 'Extensión oficial de VS Code para desarrollar agentes empresariales',
      en: 'Official VS Code extension for enterprise agent development',
    },
    contribution: {
      es: 'Fuentes de conocimiento · Sincronización de subagentes · Validación de prelanzamiento',
      en: 'Knowledge sources · Child-agent sync · Prerelease validation',
    },
  },
  {
    mark: '/assets/deck/os-gemini-cli.png',
    markAlt: 'Gemini CLI',
    name: 'Gemini CLI',
    desc: {
      es: 'Agente de código abierto para programar desde la terminal',
      en: 'Open-source coding agent for the terminal',
    },
    contribution: {
      es: 'Corrección de esquema UI · Cobertura de pruebas',
      en: 'UI schema fix · Test coverage',
    },
  },
  {
    mark: '/assets/deck/os-sklearn-mark.png',
    markAlt: 'scikit-learn-contrib',
    name: 'scikit-learn',
    desc: {
      es: 'Biblioteca de machine learning de código abierto',
      en: 'Open-source machine-learning library',
    },
    contribution: { es: 'Documentación de HDBSCAN', en: 'HDBSCAN documentation' },
  },
  {
    mark: '/assets/deck/os-beads-mark.png',
    markAlt: 'beads / bd',
    rounded: true,
    name: 'beads (bd)',
    desc: {
      es: 'Gestor de tareas basado en Git para agentes de programación',
      en: 'Git-backed issue tracking for coding agents',
    },
    contribution: {
      es: 'Enrutamiento por prefijos · Prueba de regresión write-through',
      en: 'Prefix routing · Write-through regression test',
    },
  },
];

/* -------------------------------------------------------------- 04 career */

export interface CareerRow {
  when: Bi;
  current: boolean;
  /**
   * Job titles stay as held, so both variants read the same. The degree is
   * named in the reader's language.
   */
  role: Bi;
  org: string;
  desc: Bi;
}

export const career: CareerRow[] = [
  {
    when: { es: 'Oct 2025 —<br />Presente', en: 'Oct 2025 —<br />Present' },
    current: true,
    role: { es: 'AI Intern', en: 'AI Intern' },
    org: 'CIP · CGIAR',
    desc: {
      es: 'Construyo sistemas institucionales de IA multilingüe que integran recuperación de conocimiento, flujos de agentes y evaluación basada en evidencia.',
      en: 'Building multilingual institutional AI systems across knowledge retrieval, agent workflows and evidence-grounded evaluation.',
    },
  },
  {
    when: { es: 'Dic 2024 —<br />Oct 2025', en: 'Dec 2024 —<br />Oct 2025' },
    current: false,
    role: { es: 'QA Trainee', en: 'QA Trainee' },
    org: 'VISMA LATAM',
    desc: {
      es: 'Desarrollé un agente basado en LLM que genera pruebas E2E desde especificaciones e integra suites de Cypress en Jenkins con generación guiada por el DOM.',
      en: 'Developed an LLM agent that generates E2E tests from specifications, integrating Cypress suites into Jenkins with DOM-aware generation.',
    },
  },
  {
    when: { es: 'Previsto fines de 2026', en: 'Expected late 2026' },
    current: false,
    role: { es: 'Ciencias de la Computación', en: 'B.Sc. Computer Science' },
    org: 'UPC · LIMA',
    desc: {
      es: '2.º puesto · DataFest BCP × ESAN 2025 · Beca completa SALA 2026',
      en: '2nd place · DataFest BCP × ESAN 2025 · SALA 2026 full scholarship',
    },
  },
];

/* ------------------------------------------------------------ 05 approach */

export const approach = {
  lede: {
    es: 'Todo modelo optimiza algo y sacrifica otra cosa. Mi trabajo es <span class="hl">hacer explícito ese intercambio.</span>',
    en: 'Every model optimizes something and sacrifices something else. My job is <span class="hl">making that trade explicit.</span>',
  },
  notes: [
    {
      num: '[ 01 ]',
      title: { es: 'Validar el objetivo', en: 'Validate the target' },
      body: {
        es: 'Entender qué representa realmente la variable observada.',
        en: 'Understand what the observed variable actually represents.',
      },
    },
    {
      num: '[ 02 ]',
      title: { es: 'Evaluar consecuencias', en: 'Evaluate consequences' },
      body: {
        es: 'Estudiar cómo falla el modelo y qué decisiones dependen de sus resultados.',
        en: 'Study how the model fails and which decisions depend on its outputs.',
      },
    },
    {
      num: '[ 03 ]',
      title: { es: 'Dejar evidencia', en: 'Leave evidence' },
      body: {
        es: 'Hacer reproducibles los experimentos y trazables las decisiones técnicas.',
        en: 'Make experiments reproducible and technical decisions traceable.',
      },
    },
  ],
};

/* ------------------------------------------------------------- 06 contact */

export const contact = {
  status: { es: 'Abierto a nuevas oportunidades', en: 'Open to new roles' },
  title: { es: 'Hablemos.', en: "Let's talk." },
  note: {
    es: 'Disponible para roles en ML aplicado, sistemas de IA y research engineering.',
    en: 'Open to applied ML, AI systems and research engineering roles.',
  },
};
