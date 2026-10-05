import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await p.goto(url); await p.waitForTimeout(900);
for (const s of [1, 4]) { await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"]`).click(), s); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/mob-nav-s${s}.png`, clip: { x: 0, y: 0, width: 390, height: 140 } }); }
await b.close();
