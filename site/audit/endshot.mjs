import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await p.goto(url); await p.waitForTimeout(900);
for (const s of [1,4]) { await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"]`).click(), s); await p.waitForTimeout(800);
  await p.evaluate(() => { const n = document.querySelector('#pane'); n.scrollTop = n.scrollHeight; }); await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/mob-s${s}-end.png` }); }
const d = await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); await d.goto(url+'#systems'); await d.waitForTimeout(1500); await d.screenshot({ path: `${out}/desk-s1.png` });
await b.close();
