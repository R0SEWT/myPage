import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const [vp,o] of [['desk',{viewport:{width:1440,height:900}}],['mob',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}]]) for (const path of ['/','/projects/lumi/']) {
  const ctx = await b.newContext(o); const p = await ctx.newPage(); const reqs = [];
  p.on('requestfinished', async r => { const s = await r.sizes().catch(()=>null); reqs.push({ url: r.url().replace(URL,''), type: r.resourceType(), bytes: s ? s.responseBodySize : 0 }); });
  await p.goto(URL + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const lcp = await p.evaluate(() => new Promise(r => { let v = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => r(Math.round(v)), 300); }));
  const tot = reqs.reduce((a, r) => a + r.bytes, 0); const by = {}; reqs.forEach(r => by[r.type] = (by[r.type] || 0) + r.bytes);
  console.log(`${vp} ${path}  ${(tot/1024).toFixed(0)} KB in ${reqs.length} req  LCP≈${lcp}ms(local)  ${Object.entries(by).map(([k,v])=>k+':'+(v/1024).toFixed(0)+'KB').join(' ')}`);
  for (const r of reqs.sort((a,b)=>b.bytes-a.bytes).slice(0,5)) console.log(`     ${(r.bytes/1024).toFixed(0).padStart(5)} KB  ${r.type.padEnd(10)} ${r.url.slice(0,80)}`);
  await ctx.close();
}
await b.close();
