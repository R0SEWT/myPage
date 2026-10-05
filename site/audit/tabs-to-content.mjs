// Tab presses from page load to the first focusable inside the current screen.
import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const hash of ['#systems', '#research', '#contact']) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); await p.goto(URL + hash); await p.waitForTimeout(900);
  let k = 0, hit = null;
  for (; k < 30; k++) { await p.keyboard.press('Tab'); const r = await p.evaluate(() => { const e = document.activeElement; return e && (e.closest('.screen:not([hidden])') || e.id === 'pane') ? (e.id || e.textContent.trim().slice(0, 24)) : null; }); if (r) { hit = r; break; } }
  const first = await p.evaluate(() => { const e = document.querySelector(':focus'); return null; });
  console.log(`${hash}: ${k + 1} Tab presses to reach content ("${hit}")`);
}
await b.close();
