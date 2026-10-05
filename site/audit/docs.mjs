import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) {
  const p = await (await b.newContext(o)).newPage();
  for (const path of ['/projects/lumi/','/404']) { await p.goto(url+path); await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/${vp}-${path.replace(/\W+/g,'_').replace(/^_|_$/g,'')}.png`, fullPage: path!=='/404' }); }
}
await b.close();
