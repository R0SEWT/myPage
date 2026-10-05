// WCAG 2.2 SC 2.5.8 Target Size (Minimum): every target >= 24x24 CSS px, or
// its 24px-diameter circle (centred on the target's bounding box) does not
// intersect another target or another undersized target's circle. Inline
// links in sentences are exempt and reported separately.
import { chromium } from 'playwright';
const URL = (process.env.URL || 'http://localhost:4321').replace(/\/$/, '');
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader'] });
const rows = [];
for (const [vp, o] of Object.entries({ desk: { viewport: { width: 1440, height: 900 } }, mob: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } })) {
  const p = await (await b.newContext(o)).newPage();
  await p.goto(URL + '/'); await p.waitForTimeout(1000);
  for (let s = 1; s <= 6; s++) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const vis = e => { const c = getComputedStyle(e); if (c.visibility === 'hidden' || c.display === 'none') return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const scope = [...document.querySelectorAll('.screen:not([hidden]) :is(a,button), .topbar :is(a,button), #more:not([hidden])')].filter(vis);
      const box = e => e.getBoundingClientRect();
      const inline = e => e.tagName === 'A' && /^(P|LI|SPAN)$/.test(e.parentElement.tagName) && e.parentElement.textContent.trim().length > e.textContent.trim().length + 20;
      const out = [];
      const T = scope.map(e => ({ e, r: box(e) }));
      for (const t of T) {
        const { r } = t; if (r.width >= 24 && r.height >= 24) continue;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const hits = T.filter(u => u !== t).some(u => {
          // distance from centre to other's box, and circle-circle for undersized
          const dx = Math.max(u.r.left - cx, 0, cx - u.r.right), dy = Math.max(u.r.top - cy, 0, cy - u.r.bottom);
          if (Math.hypot(dx, dy) < 12) return true;
          if (u.r.width < 24 || u.r.height < 24) { const ux = u.r.left + u.r.width / 2, uy = u.r.top + u.r.height / 2; if (Math.hypot(ux - cx, uy - cy) < 24) return true; }
          return false;
        });
        out.push({ txt: (t.e.textContent.trim() || t.e.getAttribute('aria-label') || '').slice(0, 26), cls: String(t.e.className).slice(0, 22), w: Math.round(r.width), h: Math.round(r.height), spacingOk: !hits, inline: inline(t.e) });
      }
      return out;
    });
    for (const x of r) rows.push({ vp, s, ...x });
  }
}
const fail = rows.filter(r => !r.spacingOk && !r.inline);
const seen = new Set();
console.log(`undersized ${rows.length}, failing 2.5.8 ${fail.length}`);
for (const r of rows) { const k = r.vp + r.cls + r.txt; if (seen.has(k)) continue; seen.add(k); console.log(`${r.spacingOk || r.inline ? 'ok  ' : 'FAIL'} ${r.vp} s${r.s} ${r.w}x${r.h} ${r.cls.padEnd(22)} "${r.txt}"${r.inline ? ' (inline)' : ''}`); }
await b.close();
