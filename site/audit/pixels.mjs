import { chromium } from 'playwright';
const [,, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true}]]) {
  const p = await (await b.newContext({...o, reducedMotion:'reduce'})).newPage();
  for (const path of ['/projects/arbitria/','/projects/lumi/','/projects/potato-achis/','/projects/gallstone-risk/','/404']) { await p.goto('http://localhost:4321'+path); await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/${vp}-${path.replace(/\W+/g,'_')}.png`, fullPage: true }); }
}
await b.close();
