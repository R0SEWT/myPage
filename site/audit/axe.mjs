import { chromium } from 'playwright';
import fs from 'fs';
const AXE = fs.readFileSync(process.env.AXE || 'node_modules/axe-core/axe.min.js', 'utf8');
const URL = (process.env.URL || 'http://localhost:4321').replace(/\/$/, '');
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--use-gl=swiftshader'] });
const all = {};
const run = async (p, label) => {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations
    .map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, t: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })));
  for (const v of r) { const k = v.id; (all[k] ||= { ...v, where: [] }).where.push(label); }
};
for (const [vp, opts] of Object.entries({ desk: { viewport: { width: 1440, height: 900 } }, mob: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } })) {
  const p = await (await b.newContext(opts)).newPage();
  await p.goto(URL + '/'); await p.waitForTimeout(1200);
  for (let s = 1; s <= 6; s++) { await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(900); await run(p, `${vp}:s${s}`); }
  for (const path of (process.env.PATHS || '').split(',').filter(Boolean)) { await p.goto(URL + path); await p.waitForTimeout(800); await run(p, `${vp}:${path}`); }
}
for (const v of Object.values(all)) console.log(`[${v.impact}] ${v.id} (${v.help}) x${v.n} @ ${[...new Set(v.where)].join(',')}\n    ${v.t.join(' | ')}`);
await b.close();
