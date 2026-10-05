import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const w of [320, 360, 390, 430, 768]) {
  const p = await (await b.newContext({viewport:{width:w,height:844},isMobile:true,hasTouch:true})).newPage(); await p.goto(URL); await p.waitForTimeout(700);
  const r = await p.evaluate(() => { const n = document.querySelector('.pill'); const nr = n.getBoundingClientRect();
    const items = [...n.querySelectorAll('.pill-btn, .pill-cta')]; const full = items.filter(e => { const r = e.getBoundingClientRect(); return r.left >= nr.left - 1 && r.right <= nr.right + 1; }).length;
    const cs = getComputedStyle(n); return { full, total: items.length, overflow: n.scrollWidth > n.clientWidth + 1, cue: n.dataset.more || ((cs.maskImage && cs.maskImage !== 'none') ? 'mask' : false) }; });
  console.log(`${w}px: ${r.full}/${r.total} sections fully visible, overflow=${r.overflow}, overflow cue=${r.cue}`);
}
await b.close();
