// P1b: physically-timed trackpad flick (60 Hz, exponential decay ~1.3 s), dispatched in-page
// so Playwright round-trips don't stretch the inertial tail.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [tag, url] of [['before',process.env.BASE||'http://localhost:4322/'],['after',process.env.URL||'http://localhost:4321/']]) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto(url); await p.waitForTimeout(800);
  const res = {};
  for (const [name, decay, dur] of [['flick corto',0.90,600],['flick largo',0.955,1400],['scroll lento deliberado (3 notches de mouse a 600ms)',0,0]]) {
    await p.keyboard.press('Home'); await p.waitForTimeout(700);
    res[name] = await p.evaluate(async ([decay, dur]) => {
      const cur = () => [...document.querySelectorAll('.screen')].findIndex(s => !s.hidden && !s.classList.contains('is-out'));
      const s0 = cur(); const fire = d => window.dispatchEvent(new WheelEvent('wheel', { deltaY: d }));
      if (decay) { let d = 120; const t0 = performance.now();
        await new Promise(r => { const tick = () => { fire(d); d *= decay; if (performance.now()-t0 < dur && d > 0.5) setTimeout(tick, 16); else r(); }; tick(); }); }
      else { for (let i=0;i<3;i++){ fire(100); await new Promise(r=>setTimeout(r,600)); } }
      await new Promise(r=>setTimeout(r,400)); return cur() - s0;
    }, [decay, dur]);
  }
  console.log(tag, JSON.stringify(res)); await p.close();
}
await b.close();
