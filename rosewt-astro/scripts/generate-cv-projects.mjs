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
const OUTPUT_FILE = join(OUTPUT_DIR, 'projects.tex');

// --- Frontmatter parser ---

function parseFrontmatter(content, filename) {
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

// --- Main ---

function main() {
  const files = readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.mdx'));
  const projects = [];

  for (const file of files) {
    const content = readFileSync(join(PROJECTS_DIR, file), 'utf8');
    const data = parseFrontmatter(content, file);

    if (data.published === false) continue;
    if (!data.cvBullets || !Array.isArray(data.cvBullets)) continue;

    projects.push({
      title: data.title || file.replace('.mdx', ''),
      cvStack: data.cvStack || '',
      cvBullets: data.cvBullets,
      order: data.order ?? 999,
      featured: data.featured ?? false,
    });
  }

  // Sort: featured first, then by order
  projects.sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    return a.order - b.order;
  });

  // Generate LaTeX
  const sections = projects.map((p, i) => {
    const titleParts = p.title.split(' — ');
    const name = escapeLatex(titleParts[0]);
    const subtitle = titleParts[1] ? escapeLatex(titleParts[1]) : '';
    const stack = escapeLatex(p.cvStack);
    const bullets = p.cvBullets
      .map(b => `  \\item ${escapeLatex(b)}`)
      .join('\n');

    const spacing = i > 0 ? '\n\\vspace{2pt}\n\n' : '';

    return `${spacing}\\textbf{${name}${subtitle ? ` --- ${subtitle}` : ''}} \\hfill \\textit{${stack}}
\\begin{itemize}[leftmargin=1.2em, itemsep=1pt, topsep=2pt]
${bullets}
\\end{itemize}`;
  });

  const output = `% AUTO-GENERATED from MDX frontmatter — do not edit manually
% Run: node scripts/generate-cv-projects.mjs

${sections.join('\n')}
`;

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, output, 'utf8');

  console.log(`Generated ${OUTPUT_FILE} with ${projects.length} projects`);
}

main();
