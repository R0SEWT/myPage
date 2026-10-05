import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto('http://localhost:4321/'); await p.waitForTimeout(800);
if (process.env.LANG2 !== "es") { await p.click("#lang-btn"); await p.waitForTimeout(300); }
const ES = /[áéíóúñ¿¡]|\b(de|del|la|las|los|y|para|con|en|sistema|sistemas|investigación|contacto|ver|descargar|pausar|reproducir|sección|contenido|captura|previsto|presente)\b/i;
const out = new Set();
for (let s = 0; s <= 6; s++) {
  await p.evaluate(i => document.querySelector(`[data-go="${i}"]`)?.click(), s); await p.waitForTimeout(500);
  const r = await p.evaluate((src) => {
    const re = new RegExp(src, 'i'); const o = [];
    const scope = [...document.querySelectorAll('.screen:not([hidden]) *, .topbar *, .stats *, #more, #pane, #deck-announcer')];
    for (const e of scope) {
      const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || e.closest('[data-l="es"]')) continue;
      const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (own && re.test(own)) o.push(`text  <${e.tagName.toLowerCase()} class="${e.className}">: ${own.slice(0,70)}`);
      for (const a of ['aria-label', 'alt', 'title']) { const v = e.getAttribute(a); if (v && re.test(v)) o.push(`${a.padEnd(5)} <${e.tagName.toLowerCase()} class="${e.className}">: ${v.slice(0,70)}`); }
    }
    o.push('lang=' + document.documentElement.lang + ' title=' + document.title);
    return o;
  }, ES.source);
  r.forEach(x => out.add(`s${s} ${x}`));
}
console.log([...out].join('\n'));
await b.close();
