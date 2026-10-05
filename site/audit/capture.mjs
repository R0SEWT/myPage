// Capture deck screens 01–06 (Home excluded) at desktop and mobile, plus any
// extra paths, for before/after comparison.
//   URL=http://localhost:4321/ OUT=dir node audit/capture.mjs [/projects/x/ ...]
import { chromium } from 'playwright';
import fs from 'fs';
const URL = (process.env.URL || 'http://localhost:4321/').replace(/\/$/, '');
const OUT = process.env.OUT || 'shots'; fs.mkdirSync(OUT, { recursive: true });
const SCREENS = (process.env.SCREENS || '1,2,3,4,5,6').split(',').map(Number);
const VPS = { desk: { viewport: { width: 1440, height: 900 } }, mob: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } };
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--use-gl=swiftshader', '--ignore-gpu-blocklist'] });
for (const [vp, opts] of Object.entries(VPS)) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  await p.goto(URL + '/'); await p.waitForTimeout(1500);
  for (const s of SCREENS) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`)?.click(), s);
    await p.waitForTimeout(2600);
    await p.screenshot({ path: `${OUT}/${vp}-s${s}.png` });
  }
  for (const path of process.argv.slice(2)) {
    await p.goto(URL + path); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${OUT}/${vp}-${path.replace(/\W+/g, '_')}.png`, fullPage: vp === 'desk' ? false : false });
  }
  await ctx.close();
}
await b.close();
