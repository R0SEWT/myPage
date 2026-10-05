import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) {
  const p = await (await b.newContext(o)).newPage(); await p.goto(URL); await p.waitForTimeout(800);
  const issues = []; let total = 0;
  for (let s = 1; s <= 6; s++) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    await p.evaluate(() => { document.activeElement?.blur(); window.getSelection()?.removeAllRanges(); });
    const seen = new Set(); const stops = [];
    for (let k = 0; k < 40; k++) {
      await p.keyboard.press('Tab'); await p.waitForTimeout(40);
      const r = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null;
        if (!e.dataset.fw) e.dataset.fw = Math.random().toString(36).slice(2);
        const cs = getComputedStyle(e); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
        const bx = e.getBoundingClientRect(); const pts = [[bx.left + 3, bx.top + 3], [bx.right - 3, bx.bottom - 3], [(bx.left + bx.right) / 2, (bx.top + bx.bottom) / 2]];
        const inView = bx.bottom > 0 && bx.top < innerHeight;
        const covered = inView && pts.every(([x, y]) => { const t = document.elementFromPoint(x, y); return t && !e.contains(t) && !t.contains(e) && t.closest('.topbar, #stats, #more'); });
        return { id: e.dataset.fw, name: (e.getAttribute('aria-label') || e.textContent.trim() || e.tagName).replace(/\s+/g,' ').slice(0, 26), ring, covered, inView, region: e.closest('.topbar') ? 'nav' : e.closest('.screen') ? 'screen' : e.id || e.tagName }; });
      if (!r) continue; if (seen.has(r.id)) break; seen.add(r.id); stops.push(r);
    }
    total += stops.length;
    for (const r of stops) { if (!r.ring) issues.push(`s${s} no ring: ${r.region} "${r.name}"`); if (r.covered) issues.push(`s${s} obscured: "${r.name}"`); if (!r.inView) issues.push(`s${s} off-view: "${r.name}"`); }
    console.log(`${vp} s${s}: ${stops.length} stops → ${stops.map(r => r.region === 'nav' ? 'nav' : r.name).join(' | ').slice(0, 160)}`);
  }
  console.log(`${vp} total ${total}`); [...new Set(issues)].forEach(i => console.log('   ' + i));
}
await b.close();
