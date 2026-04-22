/**
 * generate-cv-projects.mjs
 *
 * Reads MDX project frontmatter and generates cv/sections/projects.tex
 * Run: node scripts/generate-cv-projects.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, '..', 'src', 'content', 'projects');
const OUTPUT_DIR = join(__dirname, '..', '..', 'cv', 'sections');
const OUTPUT_FILE_LEGACY = join(OUTPUT_DIR, 'projects.tex');
const OUTPUT_FILE_EN = join(OUTPUT_DIR, 'projects.en.tex');
const OUTPUT_FILE_ES = join(OUTPUT_DIR, 'projects.es.tex');

// --- Frontmatter parser ---

function parseFrontmatter(content, filename) {
  content = content.replace(/\r\n?/g, '\n');

  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) throw new Error(`Missing frontmatter in ${filename}`);
  return yaml.load(match[1]);
}

// --- LaTeX escaping (covers all special characters) ---

function escapeLatex(str) {
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%#_{}]/g, m => '\\' + m)
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\$/g, '\\$')
    .replace(/≈/g, '$\\approx$')
    .replace(/→/g, '$\\rightarrow$');
}

function renderProjectLinks({ url, cvLinks }) {
  if (Array.isArray(cvLinks) && cvLinks.length > 0) {
    return cvLinks
      .map(
        ({ label, url: linkUrl }) =>
          `\\enspace\\href{\\detokenize{${linkUrl}}}{[${escapeLatex(label)}]}`
      )
      .join('');
  }

  if (!url) return '';

  const label = url.includes('github.com') ? 'GitHub' : 'Link';
  return ` \\enspace\\href{\\detokenize{${url}}}{[${label}]}`;
}

function renderProjectTitle({ title, url, cvLinks }) {
  const titleParts = title.split(' — ');
  const name = escapeLatex(titleParts[0]);
  const subtitle = titleParts[1] ? escapeLatex(titleParts[1]) : '';
  const links = renderProjectLinks({ url, cvLinks });

  return `${name}${subtitle ? ` --- ${subtitle}` : ''}${links}`;
}

function renderProjectsTex({ projects, lang }) {
  const sections = projects.map((p, i) => {
    const title = lang === 'es' ? p.titleEs : p.title;
    const bulletsSrc = lang === 'es' ? (p.cvBulletsEs ?? p.cvBullets) : p.cvBullets;

    const header = renderProjectTitle({ title, url: p.url, cvLinks: p.cvLinks });
    const stack = escapeLatex(p.cvStack);
    const bullets = bulletsSrc.map(b => `  \\item ${escapeLatex(b)}`).join('\n');

    const spacing = i > 0 ? '\n\\vspace{2pt}\n\n' : '';

    return `${spacing}\\textbf{${header}} \\hfill \\textit{${stack}}
\\begin{itemize}[leftmargin=1.2em, itemsep=1pt, topsep=2pt]
${bullets}
\\end{itemize}`;
  });

  return `% AUTO-GENERATED from MDX frontmatter — do not edit manually
% Run: node scripts/generate-cv-projects.mjs
% Lang: ${lang}

${sections.join('\n')}
`;
}

// --- Main ---

function main() {
  const files = readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.mdx'));
  const projects = [];

  for (const file of files) {
    const content = readFileSync(join(PROJECTS_DIR, file), 'utf8');
    const data = parseFrontmatter(content, file);

    if (data.includeInCv === false) continue;
    if (!data.cvBullets || !Array.isArray(data.cvBullets)) continue;

    projects.push({
      title: data.title || file.replace('.mdx', ''),
      titleEs: data.cvTitleEs || data.title || file.replace('.mdx', ''),
      cvStack: data.cvStack || '',
      cvBullets: data.cvBullets,
      cvBulletsEs: Array.isArray(data.cvBulletsEs) ? data.cvBulletsEs : null,
      url: typeof data.url === 'string' ? data.url : null,
      cvLinks: Array.isArray(data.cvLinks) ? data.cvLinks : null,
      order: data.order ?? 999,
    });
  }

  projects.sort((a, b) => a.order - b.order);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const enOut = renderProjectsTex({ projects, lang: 'en' });
  const esOut = renderProjectsTex({ projects, lang: 'es' });

  writeFileSync(OUTPUT_FILE_LEGACY, enOut, 'utf8');
  writeFileSync(OUTPUT_FILE_EN, enOut, 'utf8');
  writeFileSync(OUTPUT_FILE_ES, esOut, 'utf8');

  console.log(
    `Generated ${OUTPUT_FILE_LEGACY}, ${OUTPUT_FILE_EN}, and ${OUTPUT_FILE_ES} with ${projects.length} projects`
  );
}

main();
