/**
 * Content for the Vesper deck (home).
 *
 * Every user-facing string is bilingual. Both variants are rendered into the
 * DOM and CSS shows one of them based on `data-lang` on <html>, so the language
 * toggle costs one attribute write and no re-render.
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
  { num: '00', label: { es: 'Identidad', en: 'Identity' } },
  { num: '01', label: { es: 'Doctrina', en: 'Doctrine' } },
  { num: '02', label: { es: 'Sistemas', en: 'Systems' } },
  { num: '03', label: { es: 'Research', en: 'Research' } },
  { num: '04', label: { es: 'Linaje', en: 'Lineage' } },
  { num: '05', label: { es: 'Stack', en: 'Stack' } },
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
    fps: { es: 'Cuadros por seg', en: 'Frames per sec' },
    place: 'UTC−5 · Perú',
  },
};

/* ---------------------------------------------------------------- 00 */

export const identity = {
  wordLeft: { es: 'SISTEMAS', en: 'SYSTEMS' },
  wordRight: { es: 'REALES', en: 'IN USE' },
  blurb: {
    es: 'Modelos que sobreviven al contacto con lo real —<br />retrieval, doc AI y evaluación en producción.',
    en: 'Models that survive contact with the real —<br />retrieval, doc AI and evaluation in production.',
  },
  chips: ['Retrieval', 'Doc AI', 'Agents', 'Evaluation'],
  name: 'Rody Vilchez',
  role: 'Applied ML Engineer · Lima',
};

export const links = {
  email: 'rody.vilchez00@gmail.com',
  github: 'https://github.com/R0SEWT',
  linkedin: 'https://www.linkedin.com/in/r0sewt/',
  cvEs: '/CV.es.pdf',
  cvEn: '/CV.en.pdf',
};

/* ---------------------------------------------------------------- 01 */

export const doctrine = {
  eyebrow: { es: 'Ley de equivalencia', en: 'Law of equivalence' },
  lede: {
    es: 'Todo modelo optimiza algo y sacrifica otra cosa. Mi trabajo es <span class="hl">nombrar el intercambio.</span>',
    en: 'Every model optimizes something and sacrifices something else. My job is <span class="hl">naming the trade.</span>',
  },
  notes: [
    {
      num: '[ 01 ]',
      body: {
        es: 'Primero el costo: latencia, cobertura, error tolerable. Un sistema sin presupuesto declarado no es un sistema, es una demo.',
        en: "Cost first: latency, coverage, tolerable error. A system with no declared budget isn't a system, it's a demo.",
      },
    },
    {
      num: '[ 02 ]',
      body: {
        es: 'Después la evidencia: métrica que un evaluador externo pueda reproducir sin acceso a mi laptop.',
        en: 'Then evidence: a metric an outside evaluator can reproduce without access to my laptop.',
      },
    },
  ],
  quote: {
    es: '«Para obtener, algo de igual valor debe perderse.»',
    en: '"To obtain, something of equal value must be lost."',
  },
  cite: 'Edward Elric',
};

/* ---------------------------------------------------------------- 02 */

export interface SystemRow {
  num: string;
  title: string;
  desc: Bi;
  meta: Bi;
  year: string;
  href?: string;
}

export const systems: SystemRow[] = [
  {
    num: '001',
    title: 'GENO-MAP',
    desc: {
      es: 'Invariantes de grafos kNN para validar mapas de diversidad, sin correspondencia entre mapas.',
      en: 'kNN graph invariants to validate diversity maps, with no map-to-map correspondence.',
    },
    meta: { es: 'SALA 2026', en: 'SALA 2026' },
    year: '2025—26',
    href: 'https://github.com/R0SEWT/GENO-MAP_Correspondence-Free-Diagnostics-for-Sweet-Potato-Diversity-Maps',
  },
  {
    num: '002',
    title: 'ArbitrIA',
    desc: {
      es: 'Retrieval legal sobre PDFs multicolumna: indexación a nivel documento y chunk.',
      en: 'Legal retrieval over multi-column PDFs: document- and chunk-level indexing.',
    },
    meta: { es: 'Interno', en: 'Internal' },
    year: '2024—25',
  },
  {
    num: '003',
    title: 'Gallstone Risk',
    desc: {
      es: 'Tamizaje bajo restricciones de observabilidad: AUC conservado con menos features.',
      en: 'Screening under observability constraints: AUC preserved on fewer features.',
    },
    meta: { es: 'Demo', en: 'Demo' },
    year: '2024',
    href: 'https://gallstone.rosewt.dev/',
  },
];

/* ---------------------------------------------------------------- 03 */

export const research = {
  eyebrow: 'Research — Springer CCIS 2026',
  title: 'Imitator',
  lede: {
    es: '<span class="hl">Sin gloss:</span> traducción de lengua de señas como alineamiento latente en un LLM.',
    en: '<span class="hl">Gloss-free:</span> sign language translation as latent alignment inside an LLM.',
  },
  metrics: [
    { value: '8×10⁻⁴', accent: false, label: { es: 'MSE + cosine', en: 'MSE + cosine' } },
    { value: '0', accent: true, label: { es: 'Retraining del LLM', en: 'LLM retraining' } },
    { value: '2', accent: false, label: { es: 'WAILAMP · SIMBIG 2025', en: 'WAILAMP · SIMBIG 2025' } },
  ],
  repo: 'https://github.com/nakato156/Multimodal-Sign-Language-Model',
  repoLabel: { es: 'Repositorio ↗', en: 'Repository ↗' },
};

/* ---------------------------------------------------------------- 04 */

export interface LineageRow {
  when: Bi;
  current: boolean;
  role: string;
  org: string;
  desc: Bi;
}

export const lineage: LineageRow[] = [
  {
    when: { es: 'Oct 2025 —<br />Presente', en: 'Oct 2025 —<br />Present' },
    current: true,
    role: 'AI / Data Intern',
    org: 'CIP · CGIAR',
    desc: {
      es: 'GraphRAG sobre corpus ES/EN/FR/PT/ZH con OCR ruidoso · flota de agentes hub-and-spoke · evaluación en tres capas.',
      en: 'GraphRAG over ES/EN/FR/PT/ZH corpora with noisy OCR · hub-and-spoke agent fleet · three-layer evaluation.',
    },
  },
  {
    when: { es: 'Dic 2024 —<br />Oct 2025', en: 'Dec 2024 —<br />Oct 2025' },
    current: false,
    role: 'QA Trainee',
    org: 'Visma LATAM',
    desc: {
      es: 'Agente LLM que genera tests e2e desde especificaciones · suites Cypress en Jenkins · generadores DOM-aware.',
      en: 'LLM agent generating e2e tests from specs · Cypress suites on Jenkins · DOM-aware generators.',
    },
  },
  {
    when: { es: '2026-2', en: '2026-2' },
    current: false,
    role: 'B.Sc. Computer Science',
    org: 'UPC · Lima',
    desc: {
      es: '2.º DataFest — BCP × ESAN 2025 · beca completa SALA 2026',
      en: '2nd DataFest — BCP × ESAN 2025 · full grant SALA 2026',
    },
  },
];

/* ---------------------------------------------------------------- 05 */

export const stack = [
  { title: 'ML', items: ['PyTorch', 'scikit-learn', 'Optuna', 'Evaluation'] },
  { title: 'Retrieval', items: ['Qdrant', 'LlamaIndex', 'Embeddings', 'Chunking'] },
  { title: 'Data', items: ['FastAPI', 'PostgreSQL', 'DuckDB', 'Pandas'] },
  { title: 'Agents', items: ['Copilot Studio', 'Orchestration', 'LLM-as-judge', 'Docker · CI'] },
];

/* ---------------------------------------------------------------- 06 */

export const contact = {
  status: { es: 'Abierto a roles Applied ML', en: 'Open to Applied ML roles' },
  title: { es: 'Hablemos.', en: "Let's talk." },
  place: 'Lima · Perú',
};
