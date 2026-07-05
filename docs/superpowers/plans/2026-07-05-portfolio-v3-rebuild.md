# Portfolio v3 Rebuild (Astro) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite alchemy-themed portfolio with a new Astro site (`site/`) — dense recruiter-first home + per-project case-study pages, English content curated from github-map evidence, variant-C cold aesthetic with a subtle Andean signature.

**Architecture:** Static Astro 6 site. Projects live as a typed content collection (`src/content/projects/*.md`, glob loader + zod schema); profile data (experience, education, skills, contact) lives in `src/data/profile.ts` derived from `cv/master.md`. Plain CSS with design tokens, self-hosted fonts via Fontsource, zero client JS except a scrollspy script. Final cut-over deletes `rosewt-arariwa/` and points `netlify.toml` at `site/`.

**Tech Stack:** Astro ^6 (static output), TypeScript, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`, plain CSS. Verification: `astro check`, `astro build`, Playwright MCP (headless).

**Spec:** `docs/superpowers/specs/2026-07-05-portfolio-v3-rebuild-design.md` · **Beads epic:** rv-x75

## Global Constraints

- Language of all site copy: **English**. Tone: systems-first (what was built, architecture, real constraints). No weak language, **never invent metrics** — every factual claim must trace to `cv/master.md`, `evidence/claims.md`, or the project's public repo.
- Do NOT modify factual meaning of claims. New claim entries (Task 3) quote repos only.
- Do NOT inspect `.cv-vault/`.
- Colors: background `#0c0c0d`, single accent crimson `#b5303a`. Contrast AA minimum. Respect `prefers-reduced-motion`.
- Fonts: Inter (display/body) + JetBrains Mono (technical), self-hosted via Fontsource — no Google Fonts CDN.
- All work on branch `dev`. `rosewt-arariwa/` stays untouched and deployable until Task 10 (cut-over). Merge to `main` (deploy) is NOT part of this plan — user decides.
- Node 20 (matches `netlify.toml`).
- Commit after every task with the message given in the task.

---

### Task 1: Scaffold Astro site in `site/`

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/src/pages/index.astro`, `site/.gitignore`
- Copy: `rosewt-arariwa/public/favicon.svg`, `CV.en.pdf`, `CV.es.pdf`, `og-image.png`, `llms.txt` → `site/public/`

**Interfaces:**
- Produces: working `npm run dev` / `npm run build` / `npm run check` from `site/`.

- [ ] **Step 1: Scaffold files**

`site/package.json`:

```json
{
  "name": "rosewt-site",
  "type": "module",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^6.0.0",
    "@fontsource-variable/inter": "^5.0.0",
    "@fontsource-variable/jetbrains-mono": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0"
  }
}
```

`site/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rosewt.dev',
  output: 'static',
});
```

`site/tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

`site/.gitignore`:

```
node_modules/
dist/
.astro/
```

`site/src/pages/index.astro` (placeholder, replaced in Task 6):

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Rody Vilchez</title></head>
  <body><h1>rosewt.dev v3 — scaffold OK</h1></body>
</html>
```

- [ ] **Step 2: Install and pin versions**

Run: `cd site && npm install`
Expected: lockfile created, no errors. If `astro@^6` does not resolve, run `npm install astro@latest @astrojs/check@latest` and note the resolved major in the commit body.

- [ ] **Step 3: Copy public assets from old site**

```bash
mkdir -p site/public/assets/projects
for f in favicon.svg CV.en.pdf CV.es.pdf og-image.png llms.txt; do
  [ -f "rosewt-arariwa/public/$f" ] && cp "rosewt-arariwa/public/$f" site/public/;
done
ls site/public/
```
Expected: at minimum `favicon.svg`, `CV.en.pdf`, `CV.es.pdf` present. If `og-image.png` or `llms.txt` are missing, note it — `og-image.png` gets a follow-up issue in Task 10, and drop the `llms.txt` `<link>` in Task 2.

- [ ] **Step 4: Verify build**

Run: `cd site && npm run build && npm run check`
Expected: `astro build` completes with 1 page; `astro check` reports 0 errors.

- [ ] **Step 5: Commit**

```bash
git add site/ && git commit -m "feat(rv-x75): scaffold Astro site in site/"
```

---

### Task 2: Design tokens, global styles, base layout

**Files:**
- Create: `site/src/styles/tokens.css`, `site/src/styles/global.css`, `site/src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `BaseLayout.astro` with props `{ title: string; description: string; jsonLd?: object[] }` — every page wraps in it. CSS custom properties listed in tokens.css (`--bg`, `--surface`, `--text`, `--text-dim`, `--accent`, `--border`, `--font-sans`, `--font-mono`, spacing scale).

- [ ] **Step 1: Write tokens.css**

```css
:root {
  /* Variant C — cold minimal, Andean crimson signature */
  --bg: #0c0c0d;
  --surface: #131315;
  --border: #232326;
  --text: #ededef;
  --text-dim: #9b9ba1;
  --accent: #b5303a;        /* Andean crimson */
  --accent-soft: #d4555e;   /* AA-safe on --bg for small text */
  --ok: #3fb950;            /* availability dot */

  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, monospace;

  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 1rem;
  --space-4: 1.5rem;  --space-5: 2.5rem; --space-6: 4rem;

  --max-width: 72rem;
}
```

- [ ] **Step 2: Write global.css**

```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
a:hover, a:focus-visible { color: var(--accent-soft); }
a:focus-visible { outline: 2px solid var(--accent-soft); outline-offset: 2px; }
img { max-width: 100%; display: block; }
code, .mono { font-family: var(--font-mono); font-size: 0.85em; }
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-4); }
.section { padding: var(--space-6) 0; border-top: 1px solid var(--border); }
h1, h2, h3 { line-height: 1.2; letter-spacing: -0.02em; }
```

- [ ] **Step 3: Write BaseLayout.astro**

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/tokens.css';
import '../styles/global.css';

interface Props { title: string; description: string; jsonLd?: object[] }
const { title, description, jsonLd = [] } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="description" content={description} />
    <meta name="author" content="Rody Vilchez" />
    <meta name="theme-color" content="#0c0c0d" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
    <title>{title}</title>
    <link rel="canonical" href={canonical} />
    <link rel="help" type="text/markdown" href="/llms.txt" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://rosewt.dev/og-image.png" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Rody Vilchez" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="https://rosewt.dev/og-image.png" />
    {jsonLd.map((obj) => (
      <script type="application/ld+json" set:html={JSON.stringify(obj)} />
    ))}
  </head>
  <body>
    <slot />
  </body>
</html>
```

(If `llms.txt` was missing in Task 1, remove that `<link rel="help">` line.)

- [ ] **Step 4: Use layout in placeholder index and verify**

Update `site/src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Rody Vilchez — Applied ML Engineer" description="Applied ML Engineer: RAG systems, document intelligence, data pipelines under real constraints.">
  <main class="container"><h1>tokens OK</h1></main>
</BaseLayout>
```

Run: `cd site && npm run build && npm run check`
Expected: build passes, 0 check errors.

- [ ] **Step 5: Commit**

```bash
git add site/ && git commit -m "feat(rv-x75): design tokens, global styles, base layout with SEO head"
```

---

### Task 3: Editorial governance — claims + cv/master.md entries for the two new systems

The site will feature **Lumi (dermatomicos-Bago)** and **potato-achis**, which have no entries in `cv/master.md` or `evidence/claims.md`. Governance (`agents.md`) requires public surfaces to trace to those files, so they gain entries FIRST.

**Files:**
- Modify: `evidence/claims.md` (append to `## Systems`)
- Modify: `cv/master.md` (append to `# Selected Systems`)

**Interfaces:**
- Produces: claim ids `sys-potato-achis-001`, `sys-lumi-001` that Task 5 copy relies on.

- [ ] **Step 1: Verify claims against the repos (no invention)**

Read `/home/rosewt-dell/Code/potato-achis/README.md` and skim `/home/rosewt-dell/Code/dermatomicos-Bago/` (code + docs; local README is near-empty, use `~/Code/github-map/repos/dermatomicos-Bago.yaml` notes as pointers and confirm each fact in the repo). Confirm: MDFAN architecture, Andean augmentations, OOD/open-set rejection, timm backbones (potato-achis); FastAPI + Azure OpenAI, deterministic safety rules, ports/adapters, Docker/Azure App Service demo, CI + tests (Lumi). Drop any fact you cannot confirm in the repo.

- [ ] **Step 2: Append claims to `evidence/claims.md` under `## Systems`**

```markdown
### sys-potato-achis-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built potato-achis, a multi-source domain feature adaptation network (MDFAN) for Andean potato disease classification, with Andean field augmentations, open-set OOD rejection, and timm backbones (MobileNetV3/ResNet50), on a modern Python stack (uv, ruff, mypy, pytest, Hydra).
- `supports`:
  - `repo`: `https://github.com/R0SEWT/potato-achis`

### sys-lumi-001
- `surface`: `web`
- `publicable`: `yes`
- `claim`: Built Lumi, a caregiver copilot that wraps LLM-generated proposals in deterministic medical-safety boundaries — FastAPI service with Azure OpenAI, ports/adapters architecture, CI with tests, Docker deploy, and a live demo on Azure App Service.
- `supports`:
  - `repo`: `https://github.com/R0SEWT/dermatomicos-Bago`
  - `public_url`: `https://lumi-demo-cg65uw.azurewebsites.net`
```

Adjust wording to match what Step 1 confirmed. If the demo URL no longer resolves (check with `curl -sI`), remove that support line and drop "live demo" phrasing everywhere downstream.

- [ ] **Step 3: Append to `cv/master.md` `# Selected Systems`** (same facts, CV voice — 3 bullets each, mirroring the existing entries' style):

```markdown
## Potato-ACHIS — Domain Adaptation for Andean Crop Disease
PyTorch · timm · Hydra
GitHub: https://github.com/R0SEWT/potato-achis

- Designed a multi-source domain feature adaptation network (MDFAN) to address domain shift between public datasets and Andean field conditions
- Implemented Andean field augmentations simulating highland capture conditions, and open-set OOD rejection for unknown disease classes
- Built on a typed, tested Python stack (uv, ruff, mypy, pytest) with Hydra configs and interchangeable timm backbones

## Lumi — Caregiver Copilot with Deterministic Safety Boundaries
FastAPI · Azure OpenAI · Docker
GitHub: https://github.com/R0SEWT/dermatomicos-Bago | Demo: https://lumi-demo-cg65uw.azurewebsites.net

- Designed a caregiver copilot where LLM output is constrained by deterministic medical-safety rules rather than trusted directly
- Structured the service with ports/adapters separation between product, domain, safety, and model adapters, with CI and tests
- Deployed a live demo on Azure App Service via Docker and Azure Container Registry
```

- [ ] **Step 4: Commit and flag for user review**

```bash
git add evidence/claims.md cv/master.md
git commit -m "docs(rv-x75): claims + master entries for potato-achis and Lumi"
```

Report at the task checkpoint: these two files are user-governed; the user must skim the new entries.

---

### Task 4: Content collection schema + profile data

**Files:**
- Create: `site/src/content.config.ts`, `site/src/data/profile.ts`

**Interfaces:**
- Produces: collection `projects` with schema `{ title, tagline, result, status, stack: string[], links: { github?, demo?, poster? }, media?, mediaAlt?, order }`. `profile.ts` exports `PROFILE`, `EXPERIENCE`, `RESEARCH`, `SKILLS`, `CERTIFICATIONS`, `ACTIVITIES`, `QUICK_FACTS` with the exact shapes below. Tasks 5–7 consume both.

- [ ] **Step 1: Write `site/src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),           // one line: what the system does
    result: z.string(),            // one highlighted outcome line (▸ in UI)
    status: z.string(),            // e.g. "Restricted", "Live demo", "Stable"
    stack: z.array(z.string()),
    links: z.object({
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      poster: z.string().url().optional(),
    }).default({}),
    media: z.string().optional(),   // path under /assets/projects/
    mediaAlt: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Write `site/src/data/profile.ts`** (all copy sourced from `cv/master.md` — verbatim bullets):

```ts
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
```

- [ ] **Step 3: Verify**

Run: `cd site && npm run check`
Expected: 0 errors (collection has no entries yet — that is fine; if `astro check` errors on the empty collection dir, create `site/src/content/projects/.gitkeep`).

- [ ] **Step 4: Commit**

```bash
git add site/src/content.config.ts site/src/data/profile.ts
git commit -m "feat(rv-x75): projects collection schema and profile data from cv/master.md"
```

---

### Task 5: Project content — 4 case studies

**Files:**
- Create: `site/src/content/projects/arbitria.md`, `lumi.md`, `potato-achis.md`, `gallstone-risk.md`

**Interfaces:**
- Consumes: schema from Task 4; claim ids from Task 3.
- Produces: 4 entries whose slugs (`arbitria`, `lumi`, `potato-achis`, `gallstone-risk`) Tasks 6–7 render.

Body structure for every file: `## Problem` → `## Architecture` → `## Design decisions & constraints` → `## Evidence`. Copy below is the approved draft — refine only for factual accuracy against `cv/master.md` / claims, never add metrics.

- [ ] **Step 1: Write `arbitria.md`**

```markdown
---
title: "ArbitrIA"
tagline: "Legal retrieval system for Peruvian arbitration documents."
result: "Finer chunking improves local precision but hurts global retrieval — measured, and solved with dual document/chunk-level indexing."
status: "Restricted"
stack: ["LlamaIndex", "FastAPI", "PostgreSQL", "Docker"]
links: {}
order: 1
---

## Problem

Peruvian arbitration documents are heterogeneous PDFs: multi-column layouts,
embedded tables, inconsistent headers. Complex legal queries need precision at
two scales at once — the exact clause, and the document that contains it.

## Architecture

A retrieval system combining document-level and chunk-level indexing, served
through FastAPI with PostgreSQL persistence, containerized with Docker.
Ingestion pipelines are built to survive the worst PDFs in the corpus rather
than the best.

## Design decisions & constraints

- Evaluated chunking strategies empirically: finer segmentation improves local
  precision while hurting global retrieval. That trade-off motivated the dual
  index instead of a single-granularity design.
- Robust parsing for multi-column layouts, embedded tables, and inconsistent
  headers was treated as a first-class requirement, not a preprocessing detail.

## Evidence

This system is proprietary (built for a private client), so code and corpus
are restricted. The design and results are described here at the level the
engagement allows.
```

- [ ] **Step 2: Write `lumi.md`**

```markdown
---
title: "Lumi"
tagline: "Caregiver copilot that wraps LLM proposals in deterministic medical-safety boundaries."
result: "LLM output is never trusted directly: deterministic safety rules gate every proposal before it reaches the caregiver."
status: "Live demo"
stack: ["FastAPI", "Azure OpenAI", "Docker", "Azure App Service"]
links:
  github: "https://github.com/R0SEWT/dermatomicos-Bago"
  demo: "https://lumi-demo-cg65uw.azurewebsites.net"
order: 2
---

## Problem

Caregivers need fast, structured guidance, but a medical context is exactly
where raw LLM output is least acceptable. The system has to be useful without
ever letting the model speak unchecked.

## Architecture

A FastAPI service with Azure OpenAI behind a ports/adapters architecture:
product, domain, safety, and model adapters are separated so the safety layer
is testable in isolation. Docker image deployed to Azure App Service through
Azure Container Registry, with CI and tests in GitHub Actions.

## Design decisions & constraints

- Safety is deterministic, not prompted: policy rules gate structured AI
  proposals instead of relying on the model to self-censor.
- Ports/adapters separation keeps the LLM swappable and the safety boundary
  independent of any provider.

## Evidence

Public repo with CI, tests, and evals; live demo on Azure App Service.
Production use would still require clinical, privacy, and retention gates —
stated as such, not claimed.
```

- [ ] **Step 3: Write `potato-achis.md`**

```markdown
---
title: "Potato-ACHIS"
tagline: "Multi-source domain adaptation for Andean potato disease classification."
result: "Trains on public datasets, targets Andean field conditions: MDFAN + highland augmentations + open-set OOD rejection."
status: "Stable"
stack: ["PyTorch", "timm", "Hydra", "uv", "ruff", "mypy"]
links:
  github: "https://github.com/R0SEWT/potato-achis"
order: 3
---

## Problem

Models trained on public plant-disease datasets (PlantVillage, commercial
images) degrade under real Andean field conditions — different lighting,
backgrounds, and capture quality. Deployment also means seeing diseases the
training set never contained.

## Architecture

A Multi-source Domain Feature Adaptation Network (MDFAN): multiple source
domains, adversarial + MMD alignment components, interchangeable timm
backbones (MobileNetV3 for edge, ResNet50 for accuracy), Hydra-configured
training, and an OOD path for open-set rejection.

## Design decisions & constraints

- Andean field augmentations simulate highland capture conditions instead of
  assuming clean inputs.
- Open-set recognition is part of the design: the model can refuse unknown
  disease classes rather than misclassify them.
- Engineering floor: uv, ruff, mypy, pytest, typed code, CI — the repo is
  built to be maintained, not just to converge.

## Evidence

Public repo with tests, typed modules, Hydra configs, and CI.
```

- [ ] **Step 4: Write `gallstone-risk.md`**

```markdown
---
title: "Gallstone Risk"
tagline: "ML screening under the observability constraints of rural Peru."
result: "Controlled performance degradation as clinical features are removed — the trade-off is measured, not assumed."
status: "Live demo"
stack: ["XGBoost", "SHAP", "Optuna", "FastAPI"]
links:
  github: "https://github.com/R0SEWT/gallstone-risk-rural-peru-ml"
  demo: "https://gallstone.rosewt.dev/"
order: 4
---

## Problem

Gallstone screening models assume clinical variables that rural posts simply
do not have. The useful question is not "how accurate is the model" but "what
can it still do with what the field can actually observe".

## Architecture

Gradient-boosted models (XGBoost, Optuna-tuned) behind a FastAPI service, with
a human-in-the-loop inspection interface for individual predictions and SHAP
feature-sensitivity analysis. Live demo at gallstone.rosewt.dev (Next.js
frontend, model served from a Hugging Face Space).

## Design decisions & constraints

- Reframed prediction as a decision system under observability constraints:
  dependence on unavailable clinical variables was removed by design.
- The performance/viability trade-off is evaluated explicitly, showing
  controlled degradation as the feature space is reduced.
- Predictions ship with SHAP-based explanations so a human reviews, not obeys.

## Evidence

Public repo with ROC/PR curves, calibration analysis, repeated-CV results,
and the architecture diagram of the deployed demo.
```

- [ ] **Step 5: Verify collection loads**

Run: `cd site && npm run check`
Expected: 0 errors — schema validates all 4 files.

- [ ] **Step 6: Commit**

```bash
git add site/src/content/projects/
git commit -m "feat(rv-x75): case-study content for ArbitrIA, Lumi, Potato-ACHIS, Gallstone"
```

---

### Task 6: Home page

**Files:**
- Create: `site/src/components/Header.astro`, `Hero.astro`, `ProjectRow.astro`, `Experience.astro`, `Research.astro`, `Footer.astro`
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/styles/global.css` (append component styles)

**Interfaces:**
- Consumes: `PROFILE`, `QUICK_FACTS`, `EXPERIENCE`, `RESEARCH`, `SKILLS`, `CERTIFICATIONS`, `ACTIVITIES` from `../data/profile`; `getCollection('projects')`.
- Produces: home with section ids `#projects`, `#experience`, `#contact` (Header links + scrollspy target these).

- [ ] **Step 1: Header.astro** — sticky topbar: name (mono, links `/`), nav links to `#projects`, `#experience`, `#contact`, and a bordered "Download CV" link to `/CV.en.pdf`. Class `active` toggled by the scrollspy script.

```astro
---
import { PROFILE } from '../data/profile';
---
<header class="topbar">
  <div class="container topbar-inner">
    <a href="/" class="mono brand">rosewt.dev</a>
    <nav aria-label="Main">
      <a href="/#projects" data-spy="projects">Projects</a>
      <a href="/#experience" data-spy="experience">Experience</a>
      <a href="/#contact" data-spy="contact">Contact</a>
      <a href={PROFILE.links.cvEn} class="cv-btn">Download CV</a>
    </nav>
  </div>
</header>
```

- [ ] **Step 2: Hero.astro**

```astro
---
import { PROFILE, QUICK_FACTS } from '../data/profile';
---
<section class="hero container">
  <p class="badge"><span class="dot" aria-hidden="true"></span>{PROFILE.availability}</p>
  <h1>{PROFILE.name} — <span class="accent">{PROFILE.headline}.</span></h1>
  <p class="mono role">{PROFILE.role}</p>
  <p class="lede">{PROFILE.summary}</p>
  <p class="ctas">
    <a href="#projects" class="cta-primary">View projects</a>
    <a href={PROFILE.links.cvEn}>CV EN</a> · <a href={PROFILE.links.cvEs}>CV ES</a> ·
    <a href={PROFILE.links.github}>GitHub</a> · <a href={PROFILE.links.linkedin}>LinkedIn</a>
  </p>
  <dl class="quick-facts">
    {QUICK_FACTS.map((f) => (<div><dt class="mono">{f.label}</dt><dd>{f.value}</dd></div>))}
  </dl>
</section>
```

- [ ] **Step 3: ProjectRow.astro** — props `{ project: CollectionEntry<'projects'> }`; thumbnail left (~210px; if `media` missing render `<div class="thumb placeholder" aria-hidden="true"></div>`), right side: `<h3><a href={`/projects/${project.id}/`}>{title}</a></h3>` + status tag, tagline, `<p class="result">▸ {result}</p>`, mono stack line, links row (GitHub / Demo when present + always "Case study →" to the detail page).

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'> }
const { project } = Astro.props;
const { title, tagline, result, status, stack, links, media, mediaAlt } = project.data;
const href = `/projects/${project.id}/`;
---
<article class="project-row">
  {media
    ? <a href={href} class="thumb"><img src={media} alt={mediaAlt ?? title} loading="lazy" /></a>
    : <a href={href} class="thumb placeholder" aria-hidden="true"></a>}
  <div class="project-body">
    <h3><a href={href}>{title}</a> <span class="tag mono">{status}</span></h3>
    <p>{tagline}</p>
    <p class="result">▸ {result}</p>
    <p class="mono stack">{stack.join(' · ')}</p>
    <p class="links">
      {links.github && <a href={links.github}>GitHub</a>}
      {links.demo && <a href={links.demo}>Demo</a>}
      <a href={href}>Case study →</a>
    </p>
  </div>
</article>
```

- [ ] **Step 4: Experience.astro, Research.astro, Footer.astro** — Experience: two jobs with bullets. Research: the 3 `RESEARCH` items (title, venue in mono, summary) + `SKILLS` as compact tag rows. Footer (`id="contact"`): email as `mailto:`, GitHub/LinkedIn, then `CERTIFICATIONS` + `ACTIVITIES` + education line ("B.Sc. Computer Science — UPC, expected 2026-2") in a dim single-column list. Straightforward maps over the data — same idiom as Hero.

- [ ] **Step 5: Assemble `index.astro`** with JSON-LD

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import ProjectRow from '../components/ProjectRow.astro';
import Experience from '../components/Experience.astro';
import Research from '../components/Research.astro';
import Footer from '../components/Footer.astro';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rody Vilchez',
  url: 'https://rosewt.dev',
  jobTitle: 'Applied ML Engineer',
  description: 'Applied ML Engineer specializing in RAG systems, document intelligence, and data pipelines. Currently at CIP (CGIAR), building document processing and question answering workflows for agricultural research.',
  worksFor: { '@type': 'Organization', name: 'International Potato Center (CIP, CGIAR)', url: 'https://cipotato.org' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Peruana de Ciencias Aplicadas (UPC)' },
  sameAs: ['https://github.com/R0SEWT', 'https://www.linkedin.com/in/r0sewt/'],
  knowsAbout: ['Machine Learning', 'RAG Systems', 'Document Intelligence', 'Data Pipelines', 'Semantic Search', 'GraphRAG', 'NLP', 'PyTorch', 'LlamaIndex'],
  knowsLanguage: ['es', 'en'],
  address: { '@type': 'PostalAddress', addressLocality: 'Lima', addressCountry: 'PE' },
};
---
<BaseLayout
  title="Rody Vilchez — Applied ML Engineer"
  description="Applied ML Engineer: RAG systems, document intelligence, and data pipelines under real constraints. CIP (CGIAR), Lima."
  jsonLd={[personJsonLd]}
>
  <Header />
  <main>
    <Hero />
    <section id="projects" class="section container">
      <h2>Systems</h2>
      {projects.map((p) => <ProjectRow project={p} />)}
    </section>
    <section id="experience" class="section container">
      <div class="two-col">
        <Experience />
        <Research />
      </div>
    </section>
  </main>
  <Footer />
  <script>
    const links = document.querySelectorAll('nav a[data-spy]');
    const sections = ['projects', 'experience', 'contact']
      .map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('data-spy') === e.target.id));
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => spy.observe(s));
  </script>
</BaseLayout>
```

- [ ] **Step 6: Append component styles to `global.css`** — topbar (sticky, `backdrop-filter: blur`, border-bottom), `.badge` with green `.dot`, `.accent { color: var(--accent-soft) }`, `.quick-facts` (4-col grid → 2-col under 40rem), `.project-row` (grid `210px 1fr`, gap `var(--space-4)`, `border-top: 1px solid var(--border)`, padding block; stacks to 1 column under 40rem), `.thumb.placeholder` (aspect 4/3, `background: var(--surface)`, subtle border), `.result { color: var(--accent-soft) }`, `.tag` (bordered pill, dim), `.two-col` (grid 3fr/2fr → 1 col under 52rem), `nav a.active { color: var(--accent-soft) }`, `.cv-btn` (bordered). Keep total CSS lean; every color pair must pass AA (check `--text-dim` on `--bg` ≥ 4.5:1 — `#9b9ba1` on `#0c0c0d` passes).

- [ ] **Step 7: Verify**

Run: `cd site && npm run build && npm run check`
Expected: build outputs `/index.html`, 0 check errors.

- [ ] **Step 8: Commit**

```bash
git add site/ && git commit -m "feat(rv-x75): home — hero, project rows, experience/research, footer, scrollspy"
```

---

### Task 7: Project detail pages

**Files:**
- Create: `site/src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: collection entries (Task 5), `BaseLayout`, `Header`, `Footer`.
- Produces: `/projects/arbitria/`, `/projects/lumi/`, `/projects/potato-achis/`, `/projects/gallstone-risk/`.

- [ ] **Step 1: Write `[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((p) => ({ params: { slug: p.id }, props: { project: p } }));
}
const { project } = Astro.props;
const { title, tagline, result, status, stack, links, media, mediaAlt } = project.data;
const { Content } = await render(project);
const jsonLd = links.github ? [{
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: title,
  description: tagline,
  author: { '@type': 'Person', name: 'Rody Vilchez', url: 'https://rosewt.dev' },
  codeRepository: links.github,
  ...(links.demo ? { url: links.demo } : {}),
}] : [];
---
<BaseLayout title={`${title} — Rody Vilchez`} description={tagline} jsonLd={jsonLd}>
  <Header />
  <main class="container case-study">
    <p><a href="/#projects">← All systems</a></p>
    <h1>{title} <span class="tag mono">{status}</span></h1>
    <p class="lede">{tagline}</p>
    <p class="result">▸ {result}</p>
    {media && <img src={media} alt={mediaAlt ?? title} class="case-hero" />}
    <p class="mono stack">{stack.join(' · ')}</p>
    <p class="links">
      {links.github && <a href={links.github}>GitHub</a>}
      {links.demo && <a href={links.demo}>Live demo</a>}
    </p>
    <article class="prose"><Content /></article>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Append `.case-study` / `.prose` styles to `global.css`** — `.case-study { max-width: 46rem; padding-block: var(--space-6) }`, `.prose h2` (mono-adjacent small caps or bordered, dim), `.prose p, .prose li { color: var(--text) }`, `.case-hero { border: 1px solid var(--border); border-radius: 6px; margin-block: var(--space-4) }`.

- [ ] **Step 3: Verify**

Run: `cd site && npm run build`
Expected: 5 pages built (index + 4 project pages).

- [ ] **Step 4: Commit**

```bash
git add site/ && git commit -m "feat(rv-x75): project case-study pages at /projects/[slug]"
```

---

### Task 8: Media assets

Per the asset map spec (`2026-06-01-project-media-asset-map.md`): Gallstone has a ready architecture diagram; ArbitrIA has none by design (placeholder); Lumi and potato-achis need one narrative image each.

**Files:**
- Create: `site/public/assets/projects/gallstone-architecture.png`, `potato-achis.png` (if found), `lumi.png` (if captured)
- Modify: frontmatter `media`/`mediaAlt` of the corresponding `site/src/content/projects/*.md`

- [ ] **Step 1: Gallstone architecture diagram**

```bash
curl -sL -o site/public/assets/projects/gallstone-architecture.png \
  https://raw.githubusercontent.com/R0SEWT/gallstone-risk-rural-peru-ml/main/demo/frontend/public/architecture/gallstone_runtime_architecture.png
file site/public/assets/projects/gallstone-architecture.png
```
Expected: `PNG image data`. Then set in `gallstone-risk.md`: `media: "/assets/projects/gallstone-architecture.png"`, `mediaAlt: "Runtime architecture: Next.js frontend on Vercel calling a FastAPI model service on Hugging Face Spaces"`.

- [ ] **Step 2: potato-achis narrative image** — list candidate figures: `curl -s https://api.github.com/repos/R0SEWT/potato-achis/contents/docs 2>/dev/null` (also try `assets/`, `figures/`; local clone at `~/Code/potato-achis` may have `docs/` or notebook figures). Pick ONE self-explanatory figure (architecture or domain-shift illustration). If none exists, leave `media` unset — the placeholder is designed for this. Do not fabricate a figure.

- [ ] **Step 3: Lumi demo screenshot** — with Playwright MCP (headless): navigate to `https://lumi-demo-cg65uw.azurewebsites.net`, screenshot the landing view, save to `site/public/assets/projects/lumi.png`, set `media`/`mediaAlt` ("Lumi demo — caregiver copilot UI"). If the demo is down, skip and leave placeholder.

- [ ] **Step 4: Verify + commit**

Run: `cd site && npm run build` → passes; images render on home (spot-check in Task 9).

```bash
git add site/ && git commit -m "feat(rv-x75): project media assets (gallstone diagram, lumi/potato thumbnails)"
```

---

### Task 9: Visual + accessibility verification (Playwright)

**Files:** none created (screenshots go to `.playwright-mcp/`, gitignored).

- [ ] **Step 1: Start dev server**

Run: `cd site && npm run dev` (background). Expected: serving on `http://localhost:4321`.

- [ ] **Step 2: Playwright pass (headless MCP, navigate + screenshot in the same turn)**
  - Home desktop (1440×900): screenshot; verify hero above the fold shows badge, H1, quick-facts; 4 project rows visible with ▸ result lines.
  - Home mobile (390×844 via `browser_resize`): rows stack media-above-text; nav usable.
  - `/projects/gallstone-risk/` desktop: case study renders with diagram, prose sections, working links.
  - `browser_console_messages` on both pages: **0 errors**.

- [ ] **Step 3: Accessibility checks**
  - Keyboard: tab through header + hero CTAs — visible focus ring (from `:focus-visible` rule).
  - Contrast: verify computed pairs (`--text-dim` on `--bg`, `--accent-soft` on `--bg`, tag text) ≥ 4.5:1 — adjust token values if any pair fails, and note the change.
  - Reduced motion: emulate `prefers-reduced-motion: reduce` (Playwright `browser_run_code_unsafe` or CSS check) — no smooth-scroll/transitions.

- [ ] **Step 4: Compare against reference mockup** `docs/superpowers/specs/2026-05-31-portfolio-redesign-variant-C.png` — aesthetic match (density, hierarchy, single accent), not pixel-perfection. Fix obvious deviations (spacing, type scale) before proceeding.

- [ ] **Step 5: Content audit** — read the rendered home text against `cv/master.md` and `evidence/claims.md`: names, venues, metrics (8×10⁻⁴ is the only number allowed outside project claims), dates. Fix any drift in `profile.ts` / content files. Commit fixes if any:

```bash
git add site/ && git commit -m "fix(rv-x75): visual/a11y/content adjustments from verification pass"
```

---

### Task 10: Cut-over — burn `rosewt-arariwa/`, repoint Netlify, update docs

Only start when Tasks 1–9 are complete and verified.

**Files:**
- Delete: `rosewt-arariwa/` (entire directory)
- Modify: `netlify.toml`, `CLAUDE.md`, `agents.md`

- [ ] **Step 1: Replace `netlify.toml` build section** (keep headers; DROP the SPA catch-all redirect — Astro is multi-page and the rewrite would mask 404s):

```toml
[build]
  base    = "site/"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.svg"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

- [ ] **Step 2: Add a 404 page** `site/src/pages/404.astro` (BaseLayout, "Page not found", link home). Run `cd site && npm run build` — expect 6 pages.

- [ ] **Step 3: Delete the old site**

```bash
git rm -r rosewt-arariwa/
```

- [ ] **Step 4: Update `CLAUDE.md` and `agents.md`** — replace every `rosewt-arariwa/` reference with `site/`; update the Project Structure block to the Astro layout (src/content/projects, src/data/profile.ts, src/styles, public/assets/projects) and the Commands section (`npm run dev|build|preview|check` from `site/`; note there is no `npm run lint` — quality gate is `npm run build && npm run check`). Update the Architecture section: Astro static, content collections, plain CSS tokens. Keep deploy/MCP/beads sections intact.

- [ ] **Step 5: Full verify**

Run: `cd site && npm run build && npm run check`
Expected: clean. `git grep -l "rosewt-arariwa" -- ':!docs' ':!.beads'` → no hits outside docs/history.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(rv-x75)!: cut over to Astro site — remove rosewt-arariwa, repoint netlify"
```

- [ ] **Step 7: Close out** — `bd close` any child issues; update rv-x75 notes with what shipped; file follow-up issues (og-image regeneration if it was missing; Andean chakana signature fine-tuning — deferred per spec; Imitator/ArbitrIA media). Session close protocol: `git pull --rebase && bd dolt push && git push`. **Do NOT merge to `main`** — deploying is the user's call.

---

## Self-Review (done at planning time)

- **Spec coverage:** stack+structure (T1–2), governance for new systems (T3), schema/data (T4), curated content EN (T5), home variant C (T6), detail pages (T7), asset-map media (T8), verification incl. AA/reduced-motion/mockup/content audit (T9), cut-over + netlify + docs + 404 (T10). Out-of-scope items (i18n, chakana fine-tune, missing GIFs) filed as follow-ups in T10.
- **Placeholders:** none — all copy, code, and commands are concrete; conditional steps state their fallback (missing og-image/llms.txt, dead demo URL, no potato figure).
- **Type consistency:** `profile.ts` export names match component imports (T6); collection field names in schema (T4) match frontmatter (T5) and destructuring (T6–7); slugs are `project.id` throughout.
