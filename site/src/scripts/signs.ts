/**
 * Imitator, shown rather than told: the real keypoints of clip 1660
 * ("Hambriento") sign, then come apart and settle into the subtokens the
 * checkpoint produced for that clip.
 *
 * Both ends are data. `imitator-1660.bin` is `docs/clip_keypoints.npz` from
 * nakato156/Imitator-E1 (122 frames x 111 model-input keypoints, x/y in [0, 1],
 * y down) packed as little-endian uint16. The subtokens are that clip's row in
 * the v126 temporal run's predictions.jsonl, teacher-forced; the caption says
 * so, because free-running the same run scored 7.4% exact.
 *
 * Plays only while on screen and the tab is visible, holds a still under
 * reduced motion (followed live), and stops for good once the reader pauses
 * it (WCAG 2.2.2), like the Systems video.
 */

const SRC = '/assets/deck/imitator-1660.bin';
const FRAMES = 122;
const POINTS = 111;
const FPS = 30;
const SUBTOKENS = ['ham', 'brien', 'to'];
const WORD = 'hambriento';

// Layout after remove_keypoints (Imitator-E1 data_augmentation.py): 0-6 pose,
// 7-70 face, 71-90 left hand, 91-110 right hand. Edges as in the repo's
// make_imitator_animation.py.
const LH = 71;
const RH = 91;
const POSE_EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6]];
const HAND_EDGES: [number, number][] = [];
for (let f = 0; f < 5; f++) for (let j = 0; j < 3; j++) HAND_EDGES.push([f * 4 + j, f * 4 + j + 1]);
for (let f = 0; f < 4; f++) HAND_EDGES.push([f * 4, (f + 1) * 4]);
const EDGES: [number, number][] = [
  ...POSE_EDGES,
  ...HAND_EDGES.map(([a, b]) => [LH + a, LH + b] as [number, number]),
  ...HAND_EDGES.map(([a, b]) => [RH + a, RH + b] as [number, number]),
  [6, LH],
  [4, RH],
];

// Timeline, seconds.
const T_SIGN = FRAMES / FPS;
const T_HOLD = 0.35;
const T_FLY = 1.4;
const T_MERGE = 0.9;
const T_REST = 1.9;
const T_FADE = 0.5;
const CYCLE = T_SIGN + T_HOLD + T_FLY + T_MERGE + T_REST + T_FADE;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function initSigns() {
  const frame = document.querySelector<HTMLElement>('[data-signs]');
  const canvas = frame?.querySelector('canvas');
  const toggle = frame?.querySelector<HTMLButtonElement>('[data-signs-toggle]');
  if (!frame || !canvas || !toggle) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const css = getComputedStyle(document.documentElement);
  const color = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const GREEN = color('--v-green', '#3be0a6');
  const INK = color('--v-ink', '#edefee');
  const DIM = color('--v-dim-3', '#b1b7b5');
  const SANS = getComputedStyle(document.body).fontFamily;
  const MONO = color('--v-mono', 'ui-monospace, monospace');

  let kp: Float32Array | null = null;
  let loading = false;
  let visible = false;
  let userPaused = false;
  let raf = 0;
  let clock = 0; // seconds into the cycle
  let last = 0;
  let w = 0;
  let h = 0;

  const playing = () => visible && !userPaused && !motion.matches && !document.hidden && kp !== null;

  function resize() {
    const r = canvas!.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  // Skeleton on the left, uniform scale; the tokens gather on the right.
  function place(f: number, i: number): [number, number] {
    const s = Math.min(w * 0.55, h * 0.8);
    const o = (f * POINTS + i) * 2;
    return [w * 0.31 + (kp![o] - 0.5) * s, h * 0.46 + (kp![o + 1] - 0.5) * s];
  }

  // Each point lands on one subtoken: hands on the first two, body and face
  // on the last. A visual grouping, not an attribution.
  const chipOf = (i: number) => (i >= RH ? 0 : i >= LH ? 1 : 2);

  function chipLayout() {
    ctx!.font = `500 ${Math.max(11, w * 0.042)}px ${MONO}`;
    const pad = w * 0.03;
    const ch = Math.max(20, h * 0.15);
    const cw = Math.max(...SUBTOKENS.map((t) => ctx!.measureText(t).width)) + pad * 2;
    return SUBTOKENS.map((_, k) => ({ x: w * 0.77 - cw / 2, y: h * (0.27 + k * 0.21), w: cw, h: ch }));
  }

  function dot(x: number, y: number, r: number, fill: string, alpha: number) {
    ctx!.globalAlpha = alpha;
    ctx!.fillStyle = fill;
    ctx!.beginPath();
    ctx!.arc(x, y, r, 0, Math.PI * 2);
    ctx!.fill();
  }

  function styleOf(i: number): [string, number, number] {
    if (i >= LH) return [GREEN, 1.9, 1];
    if (i >= 7) return [DIM, 0.9, 0.45];
    return [INK, 2.1, 0.9];
  }

  function drawSkeleton(f: number, alpha: number) {
    ctx!.globalAlpha = 0.3 * alpha;
    ctx!.strokeStyle = INK;
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    for (const [a, b] of EDGES) {
      const [ax, ay] = place(f, a);
      const [bx, by] = place(f, b);
      ctx!.moveTo(ax, ay);
      ctx!.lineTo(bx, by);
    }
    ctx!.stroke();
    for (let i = 0; i < POINTS; i++) {
      const [x, y] = place(f, i);
      const [c, r, a] = styleOf(i);
      dot(x, y, r, c, a * alpha);
    }
  }

  function drawChips(chips: ReturnType<typeof chipLayout>, alpha: number, merge: number) {
    const cx = w * 0.77;
    const cy = h * 0.48;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    chips.forEach((c, k) => {
      const x = c.x + c.w / 2;
      const y = c.y + (cy - c.y) * ease(merge);
      const a = alpha * (1 - merge);
      ctx!.globalAlpha = a * 0.6;
      ctx!.strokeStyle = GREEN;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.roundRect(x - c.w / 2, y - c.h / 2, c.w, c.h, 3);
      ctx!.stroke();
      ctx!.globalAlpha = a;
      ctx!.fillStyle = GREEN;
      ctx!.font = `500 ${Math.max(11, w * 0.042)}px ${MONO}`;
      ctx!.fillText(SUBTOKENS[k], x, y + 0.5);
    });
    if (merge > 0) {
      ctx!.globalAlpha = alpha * ease(merge);
      ctx!.fillStyle = INK;
      ctx!.font = `200 ${Math.max(16, w * 0.07)}px ${SANS}`;
      ctx!.fillText(WORD, cx, cy);
    }
  }

  function draw() {
    if (!kp || !w) return;
    ctx!.clearRect(0, 0, w, h);
    ctx!.globalAlpha = 1;

    // Reduced motion: one still that holds both ends — the sign mid-way and
    // the word it decoded to.
    const t = motion.matches ? T_SIGN + T_HOLD + T_FLY + T_MERGE + 0.01 : clock;
    const lastF = FRAMES - 1;
    const chips = chipLayout();

    if (t < T_SIGN + T_HOLD) {
      drawSkeleton(Math.min(lastF, Math.floor(t * FPS)), 1);
      return;
    }

    let u = t - T_SIGN - T_HOLD;
    if (u < T_FLY) {
      const p = u / T_FLY;
      // Bones go first, then each point travels with a small stagger.
      ctx!.globalAlpha = 0.3 * (1 - clamp01(p * 3));
      drawSkeletonBones(lastF);
      let arrived = 0;
      for (let i = 0; i < POINTS; i++) {
        const delay = (i / POINTS) * 0.35;
        const q = ease(clamp01((p - delay) / 0.65));
        const [x0, y0] = place(lastF, i);
        const c = chips[chipOf(i)];
        const tx = c.x + c.w / 2 + Math.sin(i * 12.9898) * c.w * 0.3;
        const ty = c.y + Math.cos(i * 78.233) * c.h * 0.25;
        const [col, r, a] = styleOf(i);
        dot(x0 + (tx - x0) * q, y0 + (ty - y0) * q, r * (1 - 0.6 * q), col, a * (1 - q * q));
        arrived += q;
      }
      drawChips(chips, arrived / POINTS, 0);
      return;
    }
    u -= T_FLY;

    if (motion.matches) {
      drawSkeleton(Math.floor(FRAMES / 2), 0.35);
    }
    if (u < T_MERGE) {
      drawChips(chips, 1, u / T_MERGE);
      return;
    }
    u -= T_MERGE;
    const fade = u < T_REST ? 1 : 1 - clamp01((u - T_REST) / T_FADE);
    drawChips(chips, fade, 1);
  }

  function drawSkeletonBones(f: number) {
    ctx!.strokeStyle = INK;
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    for (const [a, b] of EDGES) {
      const [ax, ay] = place(f, a);
      const [bx, by] = place(f, b);
      ctx!.moveTo(ax, ay);
      ctx!.lineTo(bx, by);
    }
    ctx!.stroke();
  }

  function tick(now: number) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    clock = (clock + dt) % CYCLE;
    draw();
    raf = playing() ? requestAnimationFrame(tick) : 0;
    if (!raf) last = 0;
  }

  function sync() {
    if (playing() && !raf) raf = requestAnimationFrame(tick);
    else draw();
    const paused = !playing();
    const en = document.documentElement.dataset.lang === 'en';
    toggle!.classList.toggle('is-paused', paused);
    toggle!.setAttribute(
      'aria-label',
      paused ? (en ? 'Play animation' : 'Reproducir animación') : en ? 'Pause animation' : 'Pausar animación',
    );
  }

  async function load() {
    if (kp || loading) return;
    loading = true;
    try {
      const buf = await (await fetch(SRC)).arrayBuffer();
      const raw = new DataView(buf);
      kp = new Float32Array(FRAMES * POINTS * 2);
      for (let i = 0; i < kp.length; i++) kp[i] = raw.getUint16(i * 2, true) / 65535;
      resize();
      sync();
    } catch {
      loading = false;
    }
  }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) load();
    sync();
  }).observe(canvas);
  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    sync();
  });
  // aria-label follows the language switch.
  new MutationObserver(sync).observe(document.documentElement, { attributeFilter: ['data-lang'] });
}
