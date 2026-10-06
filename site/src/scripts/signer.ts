/**
 * Field formation for the Research screen: the particles perform Imitator's
 * clip 1660 ("Hambriento"), pass through what the model sees and does with
 * it, and come out as the subtokens the checkpoint produced and the word.
 *
 *   sign     the clip's real keypoints, played a little under real speed
 *   unroll   the same keypoints laid out over time: x is the frame, y the
 *            joint's height — the [T, 111, 2] input Imitator reads
 *   integrate the sequence condenses into one cluster per output token
 *            (schematic: split by subtoken length, not the model's alphas)
 *   tokens   ham · brien · to, then the merged word
 *
 * The data ends are real. `imitator-1660.bin` is `docs/clip_keypoints.npz`
 * from nakato156/Imitator-E1 (122 frames x 111 model-input keypoints, x/y in
 * [0, 1], y down) packed as little-endian uint16. The subtokens are that
 * clip's row in the v126 temporal run's predictions.jsonl, teacher-forced; the
 * screen says so, because free-running the same run scored 7.4% exact.
 *
 * Loaded on demand by field.ts, so the rest of the deck never pays for it.
 */

const SRC = '/assets/deck/imitator-1660.bin';
const FRAMES = 122;
const POINTS = 111;
const FPS = 30;
const SUBTOKENS = ['ham', 'brien', 'to'];
const WORD = 'hambriento';

// Layout after remove_keypoints (Imitator-E1 data_augmentation.py): 0-6 pose,
// 7-70 face, 71-90 left hand, 91-110 right hand. Edges as in the repo's
// make_imitator_animation.py; neither wrist root is among the 111, so each
// hand hangs off the last arm joint present.
const LH = 71;
const RH = 91;
const POSE: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, LH], [4, RH]];
const HAND: [number, number][] = [];
for (let f = 0; f < 5; f++) for (let j = 0; j < 3; j++) HAND.push([f * 4 + j, f * 4 + j + 1]);
for (let f = 0; f < 4; f++) HAND.push([f * 4, (f + 1) * 4]);
const FINGERS: [number, number][] = [
  ...HAND.map(([a, b]) => [LH + a, LH + b] as [number, number]),
  ...HAND.map(([a, b]) => [RH + a, RH + b] as [number, number]),
];

// World units, matching the field's shapes (about ±1.35).
const SCALE = 1.6;
const RIBBON_W = 1.6;
const RIBBON_H = 1.0;
const TEXT_W = 1.35;
const WORD_W = 1.25;

// Loop, seconds. The sign runs a little under real speed so the hands can be
// followed, and holds its last pose before it lets go.
const SPEED = 0.8;
const T_SIGN = FRAMES / FPS / SPEED;
const STAGES = [
  ['sign', T_SIGN],
  ['hold', 0.7],
  ['unroll', 1.7],
  ['ribbon', 1.3],
  ['integrate', 1.5],
  ['clusters', 0.5],
  ['spell', 1.2],
  ['tokens', 1.2],
  ['merge', 1.1],
  ['word', 2.0],
  ['back', 1.5],
] as const;
type Stage = (typeof STAGES)[number][0];

// Finger trails: some points follow the pose a few steps late, so the path of
// the sign stays on screen for a moment, not just its current shape.
const LAGS = 6;
const LAG_STEP = 0.03;

export interface Signer {
  /** Seconds in one loop. */
  cycle: number;
  /** The moment shown when motion is reduced: mid-sign. */
  still: number;
  /** Write every point's target at loop time `t` into `out` (N x 3). */
  fill(out: Float32Array, t: number): void;
}

function rnd(i: number, s: number): number {
  const x = Math.sin(i * 127.1 + s * 311.7 + 0.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Roughly normal in [-1, 1]. */
const gauss = (i: number, s: number) => (rnd(i, s) + rnd(i, s + 1) + rnd(i, s + 2)) / 1.5 - 1;
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

interface Glyphs {
  /** World x/y pairs, sorted left to right. */
  pts: Float32Array;
  cx: number;
}

/** Lit pixels of each string, laid out in one line `width` wide in world units. */
function sampleLine(words: string[], width: number, gapEm: number): Glyphs[] {
  const W = 1600;
  const H = 240;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const size = 170;
  g.font = `300 ${size}px ${family}`;
  const widths = words.map((w) => g.measureText(w).width);
  const gap = size * gapEm;
  const total = widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  const k = width / total;

  let left = -total / 2;
  return words.map((word, n) => {
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#fff';
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    g.font = `300 ${size}px ${family}`;
    g.fillText(word, 20, H / 2);
    const data = g.getImageData(0, 0, W, H).data;
    const pts: [number, number][] = [];
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 140) pts.push([(left + x - 20) * k, -(y - H / 2) * k]);
      }
    }
    pts.sort((p, q) => p[0] - q[0]);
    const cx = (left + widths[n] / 2) * k;
    left += widths[n] + gap;
    return { pts: Float32Array.from(pts.flat()), cx };
  });
}

export async function loadSigner(n: number): Promise<Signer> {
  const buf = await (await fetch(SRC)).arrayBuffer();
  const raw = new DataView(buf);
  const kp = new Float32Array(FRAMES * POINTS * 2);
  for (let i = 0; i < kp.length; i++) kp[i] = raw.getUint16(i * 2, true) / 65535;
  if ('fonts' in document) await document.fonts.ready;

  const tokens = sampleLine(SUBTOKENS, TEXT_W, 0.9);
  const [word] = sampleLine([WORD], WORD_W, 0);

  /*
   * Points go to bones by how much each bone moves over the clip, times its
   * length. The signing hand gets the light; the resting arm, the shoulder
   * line and a hand the tracker collapsed to a knot fade back.
   */
  const weights = (edges: [number, number][]) => {
    const score = edges.map(([ea, eb]) => {
      let len = 0;
      let motion = 0;
      for (let f = 0; f < FRAMES; f++) {
        const oa = (f * POINTS + ea) * 2;
        const ob = (f * POINTS + eb) * 2;
        len += Math.hypot(kp[oa] - kp[ob], kp[oa + 1] - kp[ob + 1]);
        if (f > 0) {
          const pa = oa - POINTS * 2;
          const pb = ob - POINTS * 2;
          motion += Math.hypot(kp[oa] + kp[ob] - kp[pa] - kp[pb], kp[oa + 1] + kp[ob + 1] - kp[pa + 1] - kp[pb + 1]);
        }
      }
      return [len / FRAMES, motion / FRAMES];
    });
    const maxMotion = Math.max(...score.map((s) => s[1])) || 1;
    const cum = new Float32Array(edges.length);
    let acc = 0;
    score.forEach(([len, motion], k) => {
      acc += len * (0.12 + motion / maxMotion);
      cum[k] = acc;
    });
    return cum.map((c) => c / acc);
  };
  const pick = (edges: [number, number][], cum: Float32Array, r: number) => {
    let k = 0;
    while (k < cum.length - 1 && cum[k] < r) k++;
    return edges[k];
  };
  const cumFingers = weights(FINGERS);
  const cumPose = weights(POSE);

  /* Who each point belongs to, and where it goes at every stage. */
  const KIND_FINGER = 0;
  const KIND_BODY = 1;
  const KIND_FACE = 2;
  const KIND_HAZE = 3;
  const kind = new Uint8Array(n);
  const a = new Uint8Array(n);
  const b = new Uint8Array(n);
  const t = new Float32Array(n);
  const lag = new Uint8Array(n);
  const delay = new Float32Array(n);
  const off = new Float32Array(n * 3);
  const haze = new Float32Array(n * 3);
  const ribbon = new Float32Array(n * 3);
  const cluster = new Float32Array(n * 3);
  const spelled = new Float32Array(n * 3);
  const merged = new Float32Array(n * 3);

  // Where each subtoken's share of the sequence ends, by subtoken length.
  const lengths = SUBTOKENS.map((s) => s.length);
  const total = lengths.reduce((x, y) => x + y, 0);
  const bounds = lengths.map((_, k) => lengths.slice(0, k + 1).reduce((x, y) => x + y, 0) / total);
  // Each subtoken's place inside the merged word, left to right.
  const starts = lengths.map((_, k) => lengths.slice(0, k).reduce((x, y) => x + y, 0) / total);

  for (let i = 0; i < n; i++) {
    const r = rnd(i, 21);
    let k = KIND_HAZE;
    if (r < 0.4) k = KIND_FINGER;
    else if (r < 0.52) k = KIND_BODY;
    else if (r < 0.55) k = KIND_FACE;
    kind[i] = k;
    delay[i] = rnd(i, 30);
    const o = i * 3;

    if (k === KIND_HAZE) {
      // A loose shell around the figure, so the field never empties out.
      const ang = rnd(i, 22) * Math.PI * 2;
      const rr = 0.9 + Math.pow(rnd(i, 23), 0.6) * 1.1;
      haze[o] = Math.cos(ang) * rr;
      haze[o + 1] = (rnd(i, 24) - 0.5) * 2.6;
      haze[o + 2] = Math.sin(ang) * rr * 0.6;
      continue;
    }

    if (k === KIND_FACE) {
      a[i] = b[i] = 7 + Math.floor(rnd(i, 22) * 64);
      off[o] = gauss(i, 24) * 0.009;
      off[o + 1] = gauss(i, 27) * 0.009;
      off[o + 2] = gauss(i, 40) * 0.01;
    } else {
      const e = k === KIND_FINGER ? pick(FINGERS, cumFingers, rnd(i, 22)) : pick(POSE, cumPose, rnd(i, 22));
      a[i] = e[0];
      b[i] = e[1];
      t[i] = rnd(i, 23);
      const j = k === KIND_FINGER ? 0.011 : 0.018;
      off[o] = gauss(i, 24) * j;
      off[o + 1] = gauss(i, 27) * j;
      off[o + 2] = gauss(i, 40) * j * 2;
      if (k === KIND_FINGER) {
        const q = rnd(i, 70);
        lag[i] = q < 0.75 ? 0 : 1 + Math.min(LAGS - 2, Math.floor(((q - 0.75) / 0.25) * (LAGS - 1)));
      }
    }

    // Unrolled: this point's joint at its own frame, time running left to right.
    const fr = rnd(i, 80);
    const f = Math.min(FRAMES - 1, Math.floor(fr * FRAMES));
    const oa = (f * POINTS + a[i]) * 2;
    const ob = (f * POINTS + b[i]) * 2;
    const y = kp[oa + 1] + (kp[ob + 1] - kp[oa + 1]) * t[i];
    const x = kp[oa] + (kp[ob] - kp[oa]) * t[i];
    ribbon[o] = (fr - 0.5) * RIBBON_W;
    ribbon[o + 1] = (0.5 - y) * RIBBON_H;
    ribbon[o + 2] = (x - 0.5) * 0.3;

    // Integrated: the stretch of time this point came from feeds one token.
    let tok = 0;
    while (tok < bounds.length - 1 && fr > bounds[tok]) tok++;
    const g = tokens[tok];
    const rad = 0.06 + Math.pow(rnd(i, 81), 0.5) * 0.07;
    const th = rnd(i, 82) * Math.PI * 2;
    const ph = Math.acos(2 * rnd(i, 83) - 1);
    cluster[o] = g.cx + Math.sin(ph) * Math.cos(th) * rad;
    cluster[o + 1] = Math.cos(ph) * rad;
    cluster[o + 2] = Math.sin(ph) * Math.sin(th) * rad;

    // Spelled, then merged: the same left-to-right rank in both lines, so the
    // merge reads as the subtokens sliding together.
    const q = rnd(i, 50);
    const gi = Math.min(g.pts.length / 2 - 1, Math.floor(q * (g.pts.length / 2))) * 2;
    spelled[o] = g.pts[gi];
    spelled[o + 1] = g.pts[gi + 1];
    spelled[o + 2] = gauss(i, 60) * 0.03;
    const wq = starts[tok] + q * (lengths[tok] / total);
    const wi = Math.min(word.pts.length / 2 - 1, Math.floor(wq * (word.pts.length / 2))) * 2;
    merged[o] = word.pts[wi];
    merged[o + 1] = word.pts[wi + 1];
    merged[o + 2] = spelled[o + 2];
  }

  /* Poses, one per trail slot. */
  const pose = new Float32Array(LAGS * POINTS * 2);
  function poseAt(time: number, slot: number) {
    const fx = clamp01(time / T_SIGN) * (FRAMES - 1);
    const f0 = Math.floor(fx);
    const f1 = Math.min(FRAMES - 1, f0 + 1);
    const u = fx - f0;
    for (let p = 0; p < POINTS; p++) {
      const o0 = (f0 * POINTS + p) * 2;
      const o1 = (f1 * POINTS + p) * 2;
      const o = (slot * POINTS + p) * 2;
      pose[o] = (kp[o0] + (kp[o1] - kp[o0]) * u - 0.5) * SCALE;
      pose[o + 1] = -(kp[o0 + 1] + (kp[o1 + 1] - kp[o0 + 1]) * u - 0.5) * SCALE;
    }
  }

  const sp = new Float32Array(3);
  function signerPoint(i: number) {
    const base = lag[i] * POINTS * 2;
    const pa = base + a[i] * 2;
    const pb = base + b[i] * 2;
    sp[0] = pose[pa] + (pose[pb] - pose[pa]) * t[i] + off[i * 3];
    sp[1] = pose[pa + 1] + (pose[pb + 1] - pose[pa + 1]) * t[i] + off[i * 3 + 1];
    sp[2] = off[i * 3 + 2];
  }

  const cycle = STAGES.reduce((s, [, d]) => s + d, 0);

  function stageAt(time: number): [Stage, number] {
    let s = time;
    for (const [name, d] of STAGES) {
      if (s < d) return [name, s / d];
      s -= d;
    }
    return ['back', 1];
  }

  function fill(out: Float32Array, time: number) {
    const [stage, p] = stageAt(time);

    const at = stage === 'sign' ? time : stage === 'back' ? 0 : T_SIGN;
    for (let l = 0; l < LAGS; l++) poseAt(stage === 'sign' ? Math.max(0, at - l * LAG_STEP) : at, l);

    // Which two formations this stage moves between.
    const pair: Record<Stage, [Float32Array | null, Float32Array | null]> = {
      sign: [null, null],
      hold: [null, null],
      unroll: [null, ribbon],
      ribbon: [ribbon, ribbon],
      integrate: [ribbon, cluster],
      clusters: [cluster, cluster],
      spell: [cluster, spelled],
      tokens: [spelled, spelled],
      merge: [spelled, merged],
      word: [merged, merged],
      back: [merged, null],
    };
    const [from, to] = pair[stage];

    for (let i = 0; i < n; i++) {
      const o = i * 3;
      if (kind[i] === KIND_HAZE) {
        out[o] = haze[o];
        out[o + 1] = haze[o + 1];
        out[o + 2] = haze[o + 2];
        continue;
      }
      // Points leave and arrive a little out of step, so a change reads as a
      // regrouping rather than one rigid tween.
      const e = ease(clamp01((p - delay[i] * 0.35) / 0.65));
      let fx: number;
      let fy: number;
      let fz: number;
      if (from) {
        fx = from[o];
        fy = from[o + 1];
        fz = from[o + 2];
      } else {
        signerPoint(i);
        [fx, fy, fz] = sp;
      }
      if (to === from) {
        out[o] = fx;
        out[o + 1] = fy;
        out[o + 2] = fz;
        continue;
      }
      let tx: number;
      let ty: number;
      let tzv: number;
      if (to) {
        tx = to[o];
        ty = to[o + 1];
        tzv = to[o + 2];
      } else {
        signerPoint(i);
        [tx, ty, tzv] = sp;
      }
      out[o] = fx + (tx - fx) * e;
      out[o + 1] = fy + (ty - fy) * e;
      out[o + 2] = fz + (tzv - fz) * e;
    }
  }

  return { cycle, still: T_SIGN * 0.5, fill };
}
