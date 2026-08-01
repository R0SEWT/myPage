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
}

/** Screen order drives the nav, the SYS.NN readout and the particle shape index. */
export const SCREENS: Screen[] = [
  { num: '00', label: { es: 'Home', en: 'Home' } },
  { num: '01', label: { es: 'Enfoque', en: 'Approach' } },
  { num: '02', label: { es: 'Sistemas', en: 'Systems' } },
  { num: '03', label: { es: 'Investigación', en: 'Research' } },
  { num: '04', label: { es: 'Open Source', en: 'Open Source' } },
  { num: '05', label: { es: 'Trayectoria', en: 'Career' } },
  { num: '06', label: { es: 'Contacto', en: 'Contact' } },
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
  chips: ['Retrieval', 'Agent systems', 'Evaluation', 'Urban ML'],
  name: 'Rody Vilchez',
  role: 'Applied ML Engineer',
  org: 'AI Intern · CIP–CGIAR',
};

/* ------------------------------------------------------------ 01 approach */

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

/* ------------------------------------------------------------- 02 systems */

export const systems = {
  lead: {
    eyebrow: 'Production system · CIP–CGIAR',
    title: 'CIP — Institutional AI Agent System',
    lede: 'Designed and implemented a production multi-agent system for institutional IT support.',
    note: 'Backed by a data-grounded evaluation platform spanning regression, response quality and agentic testing.',
  },
  prototype: {
    eyebrow: 'Working prototype · El Comercio',
    title: 'Wachi — Risk-Aware Pedestrian Routing',
    desc: 'Designed and built a geospatial prototype that re-ranks pedestrian routes by distance and estimated exposure derived from spatiotemporal patterns in reported incidents.',
    meta: 'H3 · Temporal decay · Post-hoc route reranking',
    video: '/assets/deck/wachi-loop.webm',
    videoLabel: 'Wachi pedestrian route reranking loop',
    caption: 'Prototype capture',
  },
};

/* ------------------------------------------------------------ 03 research */

export const research = {
  program: {
    eyebrow: 'Research program · Urban ML',
    title: 'Infelix — Learning under Imperfect Observation',
    desc: 'Investigating what crime-prediction systems learn when the record itself is shaped by who reports, what gets geocoded, and which city you train on.',
    meta: 'Placebo-controlled · 20-seed robustness analysis',
  },
  publication: {
    eyebrow: 'Published research · Springer CCIS 2895 · 2026',
    title: 'Imitator — Multimodal Sign Language Model',
    desc: 'Co-authored a gloss-free multimodal architecture aligning 2D keypoint sequences with pretrained language-model embeddings across Peruvian and Argentinian sign-language datasets.',
    doi: 'https://doi.org/10.1007/978-3-032-20322-9_23',
    doiLabel: 'DOI 10.1007/978-3-032-20322-9_23 ↗',
    cover: '/assets/deck/imitator-ccis-2895.png',
    coverAlt:
      'Information Management and Big Data — SIMBig 2025 proceedings, Springer CCIS volume 2895',
  },
};

/* --------------------------------------------------------- 04 open source */

export interface OpenSourceRow {
  mark: string;
  markAlt: string;
  /** beads ships a square app mark; the others are transparent wordmarks. */
  rounded?: boolean;
  name: string;
  desc: string;
  contribution: string;
  /** A row becomes an anchor once an approved evidence URL exists for it. */
  href?: string;
}

export const openSource: OpenSourceRow[] = [
  {
    mark: '/assets/deck/os-copilot-studio.png',
    markAlt: 'Microsoft Copilot Studio',
    name: 'Microsoft Copilot Studio',
    desc: 'Official VS Code extension for enterprise agent development',
    contribution: 'Knowledge sources · Child-agent sync · Prerelease validation',
  },
  {
    mark: '/assets/deck/os-gemini-cli.png',
    markAlt: 'Gemini CLI',
    name: 'Gemini CLI',
    desc: 'Open-source coding agent for the terminal',
    contribution: 'UI schema fix · Test coverage',
  },
  {
    mark: '/assets/deck/os-sklearn-mark.png',
    markAlt: 'scikit-learn-contrib',
    name: 'scikit-learn',
    desc: 'Open-source machine-learning library',
    contribution: 'HDBSCAN documentation',
  },
  {
    mark: '/assets/deck/os-beads-mark.png',
    markAlt: 'beads / bd',
    rounded: true,
    name: 'beads (bd)',
    desc: 'Git-backed issue tracking for coding agents',
    contribution: 'Prefix routing · Write-through regression test',
  },
];

/* -------------------------------------------------------------- 05 career */

export interface CareerRow {
  when: Bi;
  current: boolean;
  role: string;
  org: string;
  desc: string;
}

export const career: CareerRow[] = [
  {
    when: { es: 'Oct 2025 —<br />Presente', en: 'Oct 2025 —<br />Present' },
    current: true,
    role: 'AI Intern',
    org: 'CIP · CGIAR',
    desc: 'Building multilingual institutional AI systems across knowledge retrieval, agent workflows and evidence-grounded evaluation.',
  },
  {
    when: { es: 'Dic 2024 —<br />Oct 2025', en: 'Dec 2024 —<br />Oct 2025' },
    current: false,
    role: 'QA Trainee',
    org: 'VISMA LATAM',
    desc: 'Developed an LLM agent that generates E2E tests from specifications, integrating Cypress suites into Jenkins with DOM-aware generation.',
  },
  {
    when: { es: 'Previsto fines de 2026', en: 'Expected late 2026' },
    current: false,
    role: 'B.Sc. Computer Science',
    org: 'UPC · LIMA',
    desc: '2nd place · DataFest BCP × ESAN 2025 · SALA 2026 full scholarship',
  },
];

/* ------------------------------------------------------------- 06 contact */

export const contact = {
  status: { es: 'Abierto a nuevos roles', en: 'Open to new roles' },
  title: { es: 'Hablemos.', en: "Let's talk." },
  note: 'Open to applied ML, AI systems and research engineering roles.',
};
