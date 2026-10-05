import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await p.goto(url); await p.waitForTimeout(900);
for (const [s, y, name] of [[2, 9999, 'mob-s2-publication'], [1, 150, 'mob-s1-scrolled']]) {
  await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"]`).click(), s); await p.waitForTimeout(900);
  await p.evaluate(y => { const n = document.querySelector('#pane'); n.scrollTop = Math.min(y, n.scrollHeight); }, y); await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${name}.png` });
}
await b.close();
