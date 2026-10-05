import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [t,u] of [['before','http://localhost:4322/#contact'],['after','http://localhost:4321/#contact']]) {
  const p = await b.newPage({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  await p.goto(u); await p.waitForTimeout(800);
  if (t==='before') await p.evaluate(()=>document.querySelector('.pill-cta').click()), await p.waitForTimeout(800);
  console.log(t, JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.screen:not([hidden]) :is(.ct-links a,.ct-actions a)')].map(a=>{const r=a.getBoundingClientRect();return a.textContent.trim().replace(/\s+/g,' ')+' '+Math.round(r.width)+'x'+Math.round(r.height)}))));
  await p.close();
}
await b.close();
