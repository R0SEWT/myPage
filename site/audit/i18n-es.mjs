import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto('http://localhost:4321/'); await p.waitForTimeout(800);
console.log('es: lang-btn lang =', await p.getAttribute('#lang-btn','lang'));
await p.click('#lang-btn'); console.log('en: lang-btn lang =', await p.getAttribute('#lang-btn','lang')); await p.click('#lang-btn');
const EN = /\b(the|and|for|with|download|view|play|pause|section|content|capture|present|switch|english|spanish|live|systems|research|career|approach|contact)\b/i;
const out = new Set();
for (let s = 1; s <= 6; s++) {
  await p.evaluate(i => document.querySelector(`[data-go="${i}"]`)?.click(), s); await p.waitForTimeout(500);
  (await p.evaluate((src) => { const re = new RegExp(src, 'i'); const o = [];
    for (const e of document.querySelectorAll('.screen:not([hidden]) *, .topbar *, .stats *, #more, #pane')) {
      const cs = getComputedStyle(e); if (cs.display === 'none' || e.closest('[data-l="en"]')) continue;
      for (const a of ['aria-label', 'alt', 'title']) { const v = e.getAttribute(a); if (v && re.test(v)) o.push(`${a} <${e.tagName.toLowerCase()} class="${e.className}">: ${v.slice(0,60)}`); }
    } return o; }, EN.source)).forEach(x => out.add(`s${s} ${x}`));
}
console.log([...out].join('\n') || 'no English attribute leaks in ES');
await b.close();
