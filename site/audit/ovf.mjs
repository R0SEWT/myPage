import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--use-gl=swiftshader'] });
for (const url of ['http://localhost:4322/','http://localhost:4321/']) for (const [w,h] of [[1440,900],[1366,650],[1920,1080]]) {
  const p = await (await b.newContext({viewport:{width:w,height:h}})).newPage(); await p.goto(url+'#open-source'); await p.waitForTimeout(1000);
  console.log(url.includes('4322')?'before':'after ', `${w}x${h}`, 'overflow px:', await p.evaluate(()=>{const n=document.querySelector('#pane');return n.scrollHeight-n.clientHeight}));
}
await b.close();
