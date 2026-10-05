import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
const p = await (await b.newContext({viewport:{width:1024,height:768},isMobile:true,hasTouch:true})).newPage();
for (const h of ['systems','approach']) { await p.goto(url+'#'+h); await p.waitForTimeout(1200); await p.screenshot({ path: `${out}/tab-${h}.png` }); }
await b.close();
