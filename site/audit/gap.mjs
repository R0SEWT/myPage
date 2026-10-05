import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const url of ['http://localhost:4322/','http://localhost:4321/']) {
  const p = await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await p.goto(url); await p.waitForTimeout(800);
  const g=[]; for (let s=1;s<=6;s++){ await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(700);
    g.push(await p.evaluate(()=>{const sc=document.querySelector('.screen:not([hidden]):not(.is-out)'); const r=document.createRange(); r.selectNodeContents(sc.querySelector('.sec-head, .ct-status')); return Math.round(r.getBoundingClientRect().top - document.querySelector('.pill').getBoundingClientRect().bottom);})); }
  console.log(url.includes('4322')?'before':'after ', 'pill→first line (px), screens 1-6:', g.join(' '));
}
await b.close();
