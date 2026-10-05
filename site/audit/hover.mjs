import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const url of ['http://localhost:4322/','http://localhost:4321/']) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); await p.goto(url+'#open-source'); await p.waitForTimeout(1200);
  const row = p.locator('.os-row').nth(1); const before = await row.evaluate(e=>getComputedStyle(e).paddingLeft);
  await row.hover(); await p.waitForTimeout(400); const after = await row.evaluate(e=>[getComputedStyle(e).paddingLeft, getComputedStyle(e).cursor, e.tagName]);
  console.log(url.includes('4322')?'before':'after ', 'row padding', before, '→ on hover', after[0], 'cursor', after[1], after[2]);
  await p.screenshot({ path: `/tmp/claude-0/pr9/${url.includes('4322')?'before':'after'}/desk-s3-hover.png` });
}
await b.close();
