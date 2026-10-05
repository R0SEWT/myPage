// At the end of each screen (scrolled to bottom), is there any visible cue
// that another screen follows? Counts: a visible "more/next" control, or the
// stats screen counter.
import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) {
  const p = await (await b.newContext(o)).newPage(); await p.goto(URL); await p.waitForTimeout(800);
  const row = [];
  for (let s = 1; s <= 5; s++) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    await p.evaluate(() => { const n = document.querySelector('#pane'); n.scrollTop = n.scrollHeight; }); await p.waitForTimeout(400);
    row.push(await p.evaluate(() => { const vis = e => e && !e.hidden && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
      const more = document.querySelector('#more'); const stats = document.querySelector('#stat-screen-val');
      return vis(more) ? 'next:' + more.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) : vis(stats) && vis(document.querySelector('#stats')) ? 'counter' : 'none'; }));
  }
  console.log(vp, row.map((r, i) => `s${i + 1}=${r}`).join('  '));
}
await b.close();
