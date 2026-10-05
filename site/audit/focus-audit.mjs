// Keyboard focus audit, screens 01–06: every focusable gets a visible indicator
// (2.4.7) and is not hidden behind the top bar / stats bar (2.4.11); plus
// hover effects on non-interactive elements (false affordance).
import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) {
  const p = await (await b.newContext(o)).newPage(); await p.goto(URL); await p.waitForTimeout(800);
  const issues = new Set(); let n = 0;
  for (let s = 1; s <= 6; s++) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    const ids = await p.evaluate(() => [...document.querySelectorAll('.screen:not([hidden]):not(.is-out) :is(a[href],button,video,[tabindex]), #pane')].map((e, i) => { e.dataset.fa = 'f' + i; return 'f' + i; }));
    for (const id of ids) {
      await p.focus(`[data-fa="${id}"]`); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(80);
      const r = await p.evaluate(id => { const e = document.querySelector(`[data-fa="${id}"]`); if (document.activeElement !== e) return null;
        e.scrollIntoView({ block: 'nearest' });
        const cs = getComputedStyle(e); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
        const bx = e.getBoundingClientRect(); const pts = [[bx.left + 2, bx.top + 2], [bx.right - 2, bx.bottom - 2], [(bx.left + bx.right) / 2, (bx.top + bx.bottom) / 2]];
        const covered = pts.every(([x, y]) => { const t = document.elementFromPoint(x, y); return t && !e.contains(t) && !t.contains(e) && t.closest('.topbar, #stats, #more'); });
        return { name: (e.textContent.trim() || e.getAttribute('aria-label') || e.tagName).slice(0, 28), ring, covered }; }, id);
      if (!r) continue; n++;
      if (!r.ring) issues.add(`no visible focus: s${s} "${r.name}"`);
      if (r.covered) issues.add(`focus obscured by chrome: s${s} "${r.name}"`);
    }
    // false affordance: non-interactive elements whose own :hover rule exists
    const fa = await p.evaluate(() => { const out = []; const sheets = [...document.styleSheets];
      for (const sh of sheets) { let rules; try { rules = sh.cssRules; } catch { continue; }
        for (const r of rules) { if (!r.selectorText || !r.selectorText.includes(':hover')) continue;
          for (const sel of r.selectorText.split(',')) { const base = sel.replace(/:hover/g, '').trim(); if (!base) continue; let els; try { els = document.querySelectorAll(base); } catch { continue; }
            for (const e of els) { if (!e.closest('.screen:not([hidden])')) continue; const interactive = e.closest('a[href],button,[role=button],label'); if (!interactive && getComputedStyle(e).display !== 'none') out.push(base); } } } }
      return [...new Set(out)]; });
    fa.forEach(x => issues.add(`hover effect on non-interactive element: s${s} ${x}`));
  }
  console.log(`${vp}: ${n} focus stops checked`); [...issues].forEach(i => console.log('  ' + i));
}
await b.close();
