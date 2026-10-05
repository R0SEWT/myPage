import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args:['--use-gl=swiftshader','--ignore-gpu-blocklist'] });
const out = {};
const cur = p => p.evaluate(() => [...document.querySelectorAll('.screen')].findIndex(s => !s.hidden && !s.classList.contains('is-out')));

/* P1 Lucía — recruiter, MacBook trackpad. One flick = inertial wheel tail ~1.2 s. */
{
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto(URL); await p.waitForTimeout(1200);
  await p.mouse.move(700,450);
  const per = [];
  for (let f=0; f<3; f++) {
    await p.keyboard.press('Home'); await p.waitForTimeout(900);
    const s0 = await cur(p);
    let d = 90;
    for (let t=0; t<75; t++) { await p.mouse.wheel(0, d); d *= 0.94; if (d<1) break; await p.waitForTimeout(16); }
    await p.waitForTimeout(500);
    per.push((await cur(p)) - s0);
  }
  out['P1 trackpad: pantallas avanzadas por flick (ideal 1)'] = per;
  // second: small deliberate wheel notch (mouse) should still advance
  await p.keyboard.press('Home'); await p.waitForTimeout(900);
  const s0 = await cur(p); await p.mouse.wheel(0,100); await p.waitForTimeout(500);
  out['P1 mouse notch avanza'] = (await cur(p)) - s0;
  await p.close();
}

/* P2 Diego — hiring manager on phone. */
{
  const ctx = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true, deviceScaleFactor:2 });
  const p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => {
    const vh = innerHeight, st = document.querySelector('#stats')?.getBoundingClientRect(), pane = document.querySelector('#pane').getBoundingClientRect();
    return { statsPct: st && getComputedStyle(document.querySelector('#stats')).display!=='none' ? +(st.height/vh*100).toFixed(1) : 0, panePct: +(pane.height/vh*100).toFixed(1) };
  });
  out['P2 % viewport ocupado por stats bar'] = m.statsPct;
  out['P2 % viewport para contenido (pane)'] = m.panePct;
  out['P3b laptop 1366x650: % viewport para contenido'] = await (async()=>{const q=await b.newPage({viewport:{width:1366,height:650}});await q.goto(URL);await q.waitForTimeout(500);const r=await q.evaluate(()=>+(document.querySelector('#pane').getBoundingClientRect().height/innerHeight*100).toFixed(1));await q.close();return r;})();
  // tap nav "Trayectoria": is the active pill visible after?
  await p.evaluate(()=>document.querySelector('[data-go="5"]').click()); await p.waitForTimeout(500);
  out['P2 pill activo visible en nav (Enfoque)'] = await p.evaluate(() => {
    const a = document.querySelector('.pill-btn[aria-current="true"]').getBoundingClientRect(); const n = document.querySelector('.pill').getBoundingClientRect();
    return a.left >= n.left - 1 && a.right <= n.right + 1;
  });
  // "Sigue" button overlapping text?
  await p.evaluate(()=>document.querySelector('[data-go="1"]').click()); await p.waitForTimeout(600);
  out['P2 botón "Sigue" tapa texto'] = await p.evaluate(() => {
    const m = document.querySelector('#more'); if (m.hidden) return false; const r = m.getBoundingClientRect();
    const el = document.elementsFromPoint(r.left - 8, r.top + r.height/2).find(e => e.closest('.screen') && e.textContent.trim());
    return !!el;
  });
  await ctx.close();
}

/* P3 Ana — keyboard only, long screen on a short laptop. */
{
  const p = await b.newPage({ viewport:{width:1280,height:640} });
  await p.goto(URL); await p.waitForTimeout(1200);
  await p.evaluate(()=>document.querySelector('.pill [data-go="1"]').click()); await p.waitForTimeout(700);
  const ov = await p.evaluate(()=>{const n=document.querySelector('#pane');return n.scrollHeight-n.clientHeight});
  // Ana wants to read the rest of Systems: ArrowDown / Space
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(500);
  const s = await cur(p); const top = await p.evaluate(()=>document.querySelector('#pane').scrollTop);
  out['P3 overflow de Sistemas (px)'] = ov;
  out['P3 ArrowDown en pantalla larga: ¿lee el resto (scroll) o salta?'] = ov > 8 ? (s===1 && top>0 ? 'scroll ✓' : `saltó a ${s} ✗`) : 'sin overflow';
  out['P3 cambio de pantalla anunciado (aria-live)'] = await p.evaluate(()=>!!document.querySelector('[aria-live] #stat-screen-label, #deck-announcer'));
  // focus after nav click: where?
  await p.keyboard.press('Home'); await p.waitForTimeout(400);
  for (let i=0;i<4;i++) await p.keyboard.press('Tab');
  out['P3 foco tras 4 Tabs'] = await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,30));
  await p.close();
}

/* P4 Kenji — senior ML engineer sharing the Research screen with a colleague. */
{
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto(URL); await p.waitForTimeout(800);
  await p.evaluate(()=>document.querySelector('[data-go="2"]').click()); await p.waitForTimeout(400);
  const u = p.url();
  const p2 = await b.newPage({ viewport:{width:1440,height:900} });
  await p2.goto(u); await p2.waitForTimeout(800);
  out['P4 URL compartible abre en Investigación'] = (await cur(p2)) === 2 ? `✓ ${u}` : `✗ (${u} abre en ${await cur(p2)})`;
  await p.close(); await p2.close();
}

/* P5 Marta — vestibular disorder, prefers-reduced-motion. */
{
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' });
  const p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(800);
  out['P5 animaciones CSS infinitas activas con reduce'] = await p.evaluate(()=>document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations===Infinity).length);
  await ctx.close();
}

/* Luminance jump between consecutive screens (the "white screen"). */
{
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto(URL); await p.waitForTimeout(1000);
  const lum = [];
  for (let i=0;i<7;i++){ await p.evaluate(i=>document.querySelector(`[data-go="${i}"]`).click(), i); await p.waitForTimeout(700);
    const buf = await p.screenshot({ type:'png' }); lum.push(buf); }
  const { default: sharp } = await import('sharp').catch(()=>({default:null}));
  out['_lumBuffers'] = lum.length;
  for (let i=0;i<7;i++) (await import('fs')).writeFileSync(`${process.env.TAG||'x'}-lum-${i}.png`, lum[i]);
  await p.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
