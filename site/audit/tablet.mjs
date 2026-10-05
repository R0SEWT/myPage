import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [w,h] of [[768,1024],[820,1180],[1024,768],[1180,820]]) {
  const p = await (await b.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true})).newPage(); await p.goto(URL); await p.waitForTimeout(800);
  const res = [];
  for (let s=1;s<=6;s++){ await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s); await p.waitForTimeout(600);
    res.push(await p.evaluate(()=>{const n=document.querySelector('#pane'); return n.scrollHeight-n.clientHeight;}));
    if (s===1||s===3) await p.screenshot({path:`tab-${w}x${h}-s${s}.png`}); }
  const r = await p.evaluate(() => ({ pane: Math.round(document.querySelector('#pane').getBoundingClientRect().height / innerHeight * 100), stats: getComputedStyle(document.querySelector('#stats')).display !== 'none' }));
  console.log(`${w}x${h} content ${r.pane}% stats=${r.stats} overflow px per screen: ${res.join(' ')}`);
}
await b.close();
