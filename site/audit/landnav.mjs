import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const url of ['http://localhost:4322/','http://localhost:4321/']) for (const [w,h] of [[844,390],[740,360],[915,412]]) {
  const p = await (await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true})).newPage(); await p.goto(url+'#systems'); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const n = document.querySelector('.pill'); const nr = n.getBoundingClientRect(); const items = [...n.querySelectorAll('.pill-btn, .pill-cta')];
    return items.filter(e => { const r = e.getBoundingClientRect(); return r.left >= nr.left - 1 && r.right <= nr.right + 1; }).length + '/' + items.length; });
  console.log(url.includes('4322')?'before':'after ', `${w}x${h}`, 'sections fully visible', r);
  if (w===844) await p.screenshot({ path: `/tmp/claude-0/pr16/${url.includes('4322')?'before':'after'}/land-s1.png` });
}
await b.close();
