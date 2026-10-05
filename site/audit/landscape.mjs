import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [w,h] of [[844,390],[740,360],[915,412]]) {
  const p = await (await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true})).newPage(); await p.goto(URL+'#systems'); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const vh = innerHeight; const pane = document.querySelector('#pane').getBoundingClientRect(); const st = document.querySelector('#stats'); const sv = st && getComputedStyle(st).display !== 'none' ? st.getBoundingClientRect().height : 0; const tb = document.querySelector('.topbar').getBoundingClientRect();
    return { panePct: +(pane.height / vh * 100).toFixed(0), stats: Math.round(sv), topbar: Math.round(tb.height), paneH: Math.round(pane.height) }; });
  console.log(`${w}x${h}`, JSON.stringify(r));
  await p.screenshot({ path: `land-${w}.png` });
}
await b.close();
