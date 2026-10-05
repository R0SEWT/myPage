// Jaccard overlap of computed text styles (font family, text colour) between
// the deck screens and a document page: "does it draw from the same system?"
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const grab = p => p.evaluate(() => { const f = new Set(), c = new Set();
  for (const e of document.querySelectorAll('body *')) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    f.add(cs.fontFamily.split(',')[0].replace(/"/g, '').trim()); c.add(cs.color); }
  return { f: [...f], c: [...c] }; });
const J = (a, b) => { const A = new Set(a), B = new Set(b); return [...A].filter(x => B.has(x)).length / new Set([...A, ...B]).size; };
for (const url of ['http://localhost:4322', 'http://localhost:4321']) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(url + '/'); await p.waitForTimeout(800); const deck = { f: new Set(), c: new Set() };
  for (let s = 1; s <= 6; s++) { await p.evaluate(i => document.querySelector(`[data-go="${i}"]`).click(), s); await p.waitForTimeout(500); const g = await grab(p); g.f.forEach(x => deck.f.add(x)); g.c.forEach(x => deck.c.add(x)); }
  await p.goto(url + '/projects/lumi/'); await p.waitForTimeout(500); const doc = await grab(p);
  const offF = doc.f.filter(x => !deck.f.has(x)), offC = doc.c.filter(x => !deck.c.has(x));
  console.log(url.endsWith('4322') ? 'before' : 'after ', `fonts J=${J(doc.f, [...deck.f]).toFixed(2)} off-system: [${offF}]  colours J=${J(doc.c, [...deck.c]).toFixed(2)} off-system: ${offC.length}/${doc.c.length}`);
}
await b.close();
