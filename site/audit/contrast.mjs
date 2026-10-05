// Effective text contrast over the live particle field.
// For each text element: ink colour (with inherited opacity) vs background sampled
// under its box with all text hidden, 95th-percentile luminance over 3 frames.
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
const URL = process.env.URL || 'http://localhost:4321/';
const VP = process.env.VP === 'mob' ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { width: 1440, height: 900 };
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--use-gl=swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: VP.width, height: VP.height }, isMobile: VP.isMobile, hasTouch: VP.hasTouch });
const p = await ctx.newPage();
await p.goto(URL); await p.waitForTimeout(1500);

const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, bb]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
const wcag = (a, c) => { const [h, l] = [L(a), L(c)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
// APCA 0.0.98G-4g
function apca(txt, bg) {
  const Y = ([r, g, bb]) => 0.2126729 * (r / 255) ** 2.4 + 0.7151522 * (g / 255) ** 2.4 + 0.072175 * (bb / 255) ** 2.4;
  const clamp = y => (y > 0.022 ? y : y + (0.022 - y) ** 1.414);
  const yt = clamp(Y(txt)), yb = clamp(Y(bg));
  let s;
  if (yb > yt) { s = (yb ** 0.56 - yt ** 0.57) * 1.14; return s < 0.1 ? 0 : (s - 0.027) * 100; }
  s = (yb ** 0.65 - yt ** 0.62) * 1.14; return s > -0.1 ? 0 : (s + 0.027) * 100;
}
// APCA Bronze simple levels: 75 body copy, 60 other content text, 45 large
// (>=24px, or >=36px when weight <=300 — thin display type needs the size),
// 30 decorative / aria-hidden.
function apcaMin(e) {
  if (e.deco) return 30;
  if (e.px >= (e.w <= 300 ? 36 : 24)) return 45;
  if (e.body) return 75;
  return 60;
}

const rows = [];
const n = await p.evaluate(() => document.querySelectorAll('.screen').length);
for (let s = 0; s < n; s++) {
  await p.evaluate(i => document.querySelector(`.pill [data-go="${i}"], .pill-cta[data-go="${i}"]`)?.click(), s);
  await p.waitForTimeout(2600);
  const els = await p.evaluate(() => {
    const out = [];
    const vis = el => { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    const scope = [...document.querySelectorAll('.screen:not([hidden]) *, .topbar *, .stats *, #more')];
    for (const el of scope) {
      const own = [...el.childNodes].filter(c => c.nodeType === 3 && c.textContent.trim()).map(c => c.textContent.trim()).join(' ');
      if (!own || !vis(el)) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let op = 1, e = el; while (e) { op *= +getComputedStyle(e).opacity; e = e.parentElement; }
      if (op < 0.05) continue;
      const m = cs.color.match(/[\d.]+/g).map(Number);
      // own text box via range (tighter than the element box)
      const rg = document.createRange(); rg.selectNodeContents(el); const r = rg.getBoundingClientRect();
      const deco = !!el.closest('[aria-hidden="true"]');
      const classes = String(el.className?.baseVal ?? el.className).split(/\s+/);
      const body = !deco && (el.tagName === 'P' || classes.some(c => /(desc|lede|body|blurb|contribution|note)$/.test(c)));
      out.push({ deco, body, text: own.slice(0, 48), cls: (el.className?.baseVal ?? el.className) || el.tagName, rgb: m.slice(0, 3), a: (m[3] ?? 1) * op,
        px: parseFloat(cs.fontSize), w: +cs.fontWeight, box: [Math.max(0, r.left), Math.max(0, r.top), Math.min(innerWidth, r.right), Math.min(innerHeight, r.bottom)] });
    }
    return out;
  });
  await p.addStyleTag({ content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important} img,video{visibility:hidden!important}' }).then(h => p.evaluate(() => document.querySelector('style:last-of-type').id = 'hide-ink'));
  const shots = [];
  for (let k = 0; k < 3; k++) { shots.push(PNG.sync.read(await p.screenshot())); await p.waitForTimeout(400); }
  await p.evaluate(() => document.getElementById('hide-ink')?.remove());
  for (const e of els) {
    const [x0, y0, x1, y1] = e.box.map(Math.round);
    // p95 per frame, then the median frame: a particle streak crossing the box
    // in one frame of a morph should not stand for the screen at rest.
    const perFrame = [];
    for (const img of shots) {
      const lums = [];
      for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
        const i = (y * img.width + x) * 4; const c = [img.data[i], img.data[i + 1], img.data[i + 2]]; lums.push([L(c), c]);
      }
      if (!lums.length) continue;
      lums.sort((a, c) => a[0] - c[0]); perFrame.push(lums[Math.floor(lums.length * 0.95)]);
    }
    if (!perFrame.length) continue;
    perFrame.sort((a, c) => a[0] - c[0]); const bg = perFrame[Math.floor(perFrame.length / 2)][1];
    const ink = e.rgb.map((c, i) => c * e.a + bg[i] * (1 - e.a)); // composite ink over bg
    rows.push({ s, ...e, bg, ratio: +wcag(ink, bg).toFixed(2), lc: +Math.abs(apca(ink, bg)).toFixed(0), need: (e.px >= 24 || (e.px >= 18.66 && e.w >= 700)) ? 3 : 4.5, lcMin: apcaMin(e) });
  }
}
const fails = rows.filter(r => r.ratio < r.need);
const apcaFails = rows.filter(r => r.lc < r.lcMin);
console.log(JSON.stringify({ total: rows.length, wcagFails: fails.length, apcaFails: apcaFails.length }));
const key = r => `${r.s} ${String(r.cls).slice(0, 26).padEnd(26)} ${r.px}px/${r.w} wcag=${r.ratio}(${r.need}) Lc=${r.lc}(${r.lcMin}) bg=${r.bg} "${r.text}"`;
const seen = new Set();
for (const r of [...fails, ...apcaFails.filter(r => !fails.includes(r))]) { const k = r.s + r.cls + r.px; if (seen.has(k)) continue; seen.add(k); if (process.env.ALL || r.ratio < r.need || r.lc < r.lcMin - 0) console.log((r.ratio < r.need ? 'W ' : 'A ') + key(r)); }
await b.close();
