// Screenshot + areas of interest per screen, for the saliency audit.
import { chromium } from 'playwright';
import fs from 'fs';
const URL = process.env.URL || 'http://localhost:4321/'; const TAG = process.env.TAG || 'after';
const VP = process.env.VP === 'mob' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--use-gl=swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: VP, isMobile: process.env.VP === 'mob', hasTouch: process.env.VP === 'mob' });
await p.goto(URL); await p.waitForTimeout(1500);
const AOI = {
  claim: '.screen:not([hidden]) :is(.id-row,.id-name,.id-role,.lead-title,.media-title,.os-name,.lin-role,.approach-lede,.ct-title,.ct-mail,.note-title)',
  evidence: '.screen:not([hidden]) :is(.id-blurb p,.lead-lede,.lead-note,.lead-desc,.media-desc,.media-meta,.media-frame,.pub-cover,.os-desc,.os-contribution,.lin-desc,.lin-when,.note-body,.ct-note,.os-mark)',
  cta: '.screen:not([hidden]) :is(.btn-recruiter,.chip,.ct-links a,.id-links a,.pub-doi)',
  chrome: ':is(.topbar .tb-id,.topbar .pill,.topbar .tb-meta,#stats,#more:not([hidden]))',
};
const meta = [];
for (let s = 0; s < 7; s++) {
  if (s) await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`).click(), s);
  await p.waitForTimeout(2600);
  const boxes = await p.evaluate(AOI => Object.fromEntries(Object.entries(AOI).map(([k, sel]) => [k,
    [...document.querySelectorAll(sel)].map(e => e.getBoundingClientRect()).filter(r => r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight)
      .map(r => [r.left, r.top, r.right, r.bottom].map(Math.round))])), AOI);
  await p.screenshot({ path: `${TAG}-${process.env.VP || 'desk'}-sal-${s}.png` });
  const h = await p.addStyleTag({ content: '*{color:transparent!important;border-color:transparent!important} img,video{visibility:hidden!important}' });
  await p.evaluate(() => { const st = document.querySelectorAll('style'); st[st.length - 1].id = 'hide'; });
  await p.screenshot({ path: `${TAG}-${process.env.VP || 'desk'}-bg-${s}.png` });
  await p.evaluate(() => document.getElementById('hide').remove());
  meta.push(boxes);
}
fs.writeFileSync(`${TAG}-${process.env.VP || 'desk'}-aoi.json`, JSON.stringify(meta));
await b.close();
