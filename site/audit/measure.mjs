// chars/line of body copy per screen, and gap between nav pill and pane top
import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [vp,o] of [['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['desk',{viewport:{width:1440,height:900}}]]) {
  const p = await (await b.newContext(o)).newPage(); await p.goto(URL); await p.waitForTimeout(800);
  const res = [];
  for (let s=1;s<=6;s++) {
    await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    res.push(...await p.evaluate((s)=>{
      const out=[]; for (const e of [...document.querySelectorAll('.screen:not([hidden]) :is(.media-desc,.lead-desc,.lead-note,.os-desc,.lin-desc,.note-body,.ct-note)')].filter(e=>getComputedStyle(e).display!=='none')) {
        const rects=[...(()=>{const r=document.createRange(); r.selectNodeContents(e); return r.getClientRects();})()];
        const lines=new Set(rects.map(r=>Math.round(r.top))).size; const chars=e.textContent.trim().length;
        out.push(`s${s} ${e.className.split(' ')[0]}: ${lines} lines, ~${Math.round(chars/lines)} ch/line`);
      } return out;}, s));
  }
  const gap = await p.evaluate(()=>Math.round(document.querySelector('#pane').getBoundingClientRect().top - document.querySelector('.pill').getBoundingClientRect().bottom));
  console.log(vp, 'pill→pane gap', gap, 'px\n  ' + res.filter(r=>vp==='mob'||/media-desc/.test(r)).join('\n  '));
}
await b.close();
