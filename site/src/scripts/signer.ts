/**
 * Field formation for the Research screen: the particles perform Imitator's
 * clip 1660 ("Hambriento"), then regroup into the subtokens the checkpoint
 * produced for it and merge into the word.
 *
 * Both ends are data. `imitator-1660.bin` is `docs/clip_keypoints.npz` from
 * nakato156/Imitator-E1 (122 frames x 111 model-input keypoints, x/y in [0, 1],
 * y down) packed as little-endian uint16. The subtokens are that clip's row in
 * the v126 temporal run's predictions.jsonl, teacher-forced; the screen says
 * so, because free-running the same run scored 7.4% exact.
 *
 * Loaded on demand by field.ts, so the rest of the deck never pays for it.
 */

const SRC = '/assets/deck/imitator-1660.bin';
const FRAMES = 122;
const POINTS = 111;
const FPS = 30;
const TOKENS = 'ham   brien   to';
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
const CY = 0.0;

// Loop, seconds. The sign runs a little under real speed so the hands can
// be followed, and holds its last pose before it lets go.
const SPEED = 0.8;
const T_SIGN = FRAMES / FPS / SPEED;
const T_HOLD = 0.9;

// Finger trails: some points follow the pose a few steps late, so the path
// of the sign stays on screen for a moment, not just its current shape.
const LAGS = 6;
const LAG_STEP = 0.03;
const T_TO_TOKENS = 1.5;
const T_TOKENS = 1.4;
const T_MERGE = 1.1;
const T_WORD = 2.2;
const T_BACK = 1.5;

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

/** Lit pixels of `text`, as world x/y pairs sorted left to right. */
function sampleText(text: string, width: number): Float32Array {
  const W = 1400;
  const H = 220;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
  let size = 170;
  g.font = `300 ${size}px ${family}`;
  size *= Math.min(1, (W * 0.94) / g.measureText(text).width);
  g.font = `300 ${size}px ${family}`;
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, W / 2, H / 2);
  const data = g.getImageData(0, 0, W, H).data;

  const pts: number[] = [];
  let minX = W;
  let maxX = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 140) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  const k = width / Math.max(1, maxX - minX);
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i += 2) out.push([(pts[i] - W / 2) * k, -(pts[i + 1] - H / 2) * k + CY]);
  out.sort((a, b) => a[0] - b[0]);
  return Float32Array.from(out.flat());
}

export async function loadSigner(n: number): Promise<Signer> {
  const buf = await (await fetch(SRC)).arrayBuffer();
  const raw = new DataView(buf);
  const kp = new Float32Array(FRAMES * POINTS * 2);
  for (let i = 0; i < kp.length; i++) kp[i] = raw.getUint16(i * 2, true) / 65535;
  if ('fonts' in document) await document.fonts.ready;

  // Points go to bones in proportion to how long each bone is across the
  // clip, so a hand the tracker collapsed to a knot gets few points instead
  // of a bright clump, and the fingers that open and move get the most.
  const weights = (edges: [number, number][]) => {
    const cum = new Float32Array(edges.length);
    let acc = 0;
    edges.forEach(([ea, eb], k) => {
      let len = 0;
      for (let f = 0; f < FRAMES; f++) {
        const oa = (f * POINTS + ea) * 2;
        const ob = (f * POINTS + eb) * 2;
        len += Math.hypot(kp[oa] - kp[ob], kp[oa + 1] - kp[ob + 1]);
      }
      acc += len / FRAMES;
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

  const tokens = sampleText(TOKENS, 1.35);
  const word = sampleText(WORD, 1.25);

  /*
   * Who each point belongs to. Fingers carry the meaning, so they get the
   * most light; arms and torso less; the face is a faint mask; the rest stays
   * loose around the figure so the field never empties out.
   */
  const KIND_FINGER = 0;
  const KIND_BODY = 1;
  const KIND_FACE = 2;
  const KIND_HAZE = 3;
  const kind = new Uint8Array(n);
  const a = new Uint8Array(n);
  const b = new Uint8Array(n);
  const t = new Float32Array(n);
  const off = new Float32Array(n * 3);
  const haze = new Float32Array(n * 3);
  const tokIdx = new Uint32Array(n);
  const wordIdx = new Uint32Array(n);
  const delay = new Float32Array(n);
  const lag = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    const r = rnd(i, 21);
    let k = KIND_HAZE;
    if (r < 0.38) k = KIND_FINGER;
    else if (r < 0.52) k = KIND_BODY;
    else if (r < 0.555) k = KIND_FACE;
    kind[i] = k;
    delay[i] = rnd(i, 30);

    if (k === KIND_FINGER || k === KIND_BODY) {
      const e =
        k === KIND_FINGER ? pick(FINGERS, cumFingers, rnd(i, 22)) : pick(POSE, cumPose, rnd(i, 22));
      if (k === KIND_FINGER) {
        const q = rnd(i, 70);
        lag[i] = q < 0.75 ? 0 : 1 + Math.min(LAGS - 2, Math.floor(((q - 0.75) / 0.25) * (LAGS - 1)));
      }
      a[i] = e[0];
      b[i] = e[1];
      t[i] = rnd(i, 23);
      const j = k === KIND_FINGER ? 0.011 : 0.022;
      off[i * 3] = gauss(i, 24) * j;
      off[i * 3 + 1] = gauss(i, 27) * j;
      off[i * 3 + 2] = gauss(i, 40) * j * 2;
    } else if (k === KIND_FACE) {
      a[i] = b[i] = 7 + Math.floor(rnd(i, 22) * 64);
      off[i * 3] = gauss(i, 24) * 0.009;
      off[i * 3 + 1] = gauss(i, 27) * 0.009;
      off[i * 3 + 2] = gauss(i, 40) * 0.01;
    } else {
      // A loose shell around the figure, thicker towards the floor.
      const ang = rnd(i, 22) * Math.PI * 2;
      const rr = 0.9 + Math.pow(rnd(i, 23), 0.6) * 1.1;
      haze[i * 3] = Math.cos(ang) * rr;
      haze[i * 3 + 1] = (rnd(i, 24) - 0.5) * 2.6;
      haze[i * 3 + 2] = Math.sin(ang) * rr * 0.6;
    }

    if (k !== KIND_HAZE) {
      // Ranked by a hash, the figure's points spread evenly over the letters;
      // the same rank in both texts makes the merge a slide to the left.
      const q = rnd(i, 50);
      tokIdx[i] = Math.min(tokens.length / 2 - 1, Math.floor(q * (tokens.length / 2)));
      wordIdx[i] = Math.min(word.length / 2 - 1, Math.floor(q * (word.length / 2)));
    }
  }

  const pose = new Float32Array(LAGS * POINTS * 2);

  /** Pose at loop time `time` into lag slot `slot`. */
  function poseAt(time: number, slot: number) {
    const fx = clamp01(time / T_SIGN) * (FRAMES - 1);
    const f0 = Math.floor(fx);
    const f1 = Math.min(FRAMES - 1, f0 + 1);
    const u = fx - f0;
    for (let p = 0; p < POINTS; p++) {
      const o0 = (f0 * POINTS + p) * 2;
      const o1 = (f1 * POINTS + p) * 2;
      const x = kp[o0] + (kp[o1] - kp[o0]) * u;
      const y = kp[o0 + 1] + (kp[o1 + 1] - kp[o0 + 1]) * u;
      const o = (slot * POINTS + p) * 2;
      pose[o] = (x - 0.5) * SCALE;
      pose[o + 1] = -(y - 0.5) * SCALE + CY;
    }
  }

  const sx = new Float32Array(3);
  function signerPoint(i: number) {
    const base = lag[i] * POINTS * 2;
    const pa = base + a[i] * 2;
    const pb = base + b[i] * 2;
    sx[0] = pose[pa] + (pose[pb] - pose[pa]) * t[i] + off[i * 3];
    sx[1] = pose[pa + 1] + (pose[pb + 1] - pose[pa + 1]) * t[i] + off[i * 3 + 1];
    sx[2] = off[i * 3 + 2];
  }

  const tz = (i: number) => gauss(i, 60) * 0.03;

  function fill(out: Float32Array, time: number) {
    let s = time;
    const phase = (() => {
      if (s < T_SIGN + T_HOLD) return 0;
      s -= T_SIGN + T_HOLD;
      if (s < T_TO_TOKENS) return 1;
      s -= T_TO_TOKENS;
      if (s < T_TOKENS) return 2;
      s -= T_TOKENS;
      if (s < T_MERGE) return 3;
      s -= T_MERGE;
      if (s < T_WORD) return 4;
      s -= T_WORD;
      return 5;
    })();
    const p =
      phase === 1 ? s / T_TO_TOKENS : phase === 3 ? s / T_MERGE : phase === 5 ? s / T_BACK : 0;

    const at = phase === 0 ? time : phase === 5 ? 0 : T_SIGN;
    for (let l = 0; l < LAGS; l++) poseAt(phase === 0 ? Math.max(0, at - l * LAG_STEP) : at, l);

    for (let i = 0; i < n; i++) {
      const o = i * 3;
      if (kind[i] === KIND_HAZE) {
        out[o] = haze[o];
        out[o + 1] = haze[o + 1];
        out[o + 2] = haze[o + 2];
        continue;
      }
      const ti = tokIdx[i] * 2;
      const wi = wordIdx[i] * 2;
      // Points leave and arrive a little out of step, so it reads as a
      // regrouping rather than one rigid tween.
      const e = ease(clamp01((p - delay[i] * 0.35) / 0.65));
      let x = 0;
      let y = 0;
      let z = 0;
      if (phase === 0) {
        signerPoint(i);
        [x, y, z] = sx;
      } else if (phase === 1) {
        signerPoint(i);
        x = sx[0] + (tokens[ti] - sx[0]) * e;
        y = sx[1] + (tokens[ti + 1] - sx[1]) * e;
        z = sx[2] + (tz(i) - sx[2]) * e;
      } else if (phase === 2) {
        x = tokens[ti];
        y = tokens[ti + 1];
        z = tz(i);
      } else if (phase === 3) {
        x = tokens[ti] + (word[wi] - tokens[ti]) * e;
        y = tokens[ti + 1] + (word[wi + 1] - tokens[ti + 1]) * e;
        z = tz(i);
      } else if (phase === 4) {
        x = word[wi];
        y = word[wi + 1];
        z = tz(i);
      } else {
        signerPoint(i);
        x = word[wi] + (sx[0] - word[wi]) * e;
        y = word[wi + 1] + (sx[1] - word[wi + 1]) * e;
        z = tz(i) + (sx[2] - tz(i)) * e;
      }
      out[o] = x;
      out[o + 1] = y;
      out[o + 2] = z;
    }
  }

  return {
    cycle: T_SIGN + T_HOLD + T_TO_TOKENS + T_TOKENS + T_MERGE + T_WORD + T_BACK,
    still: T_SIGN * 0.5,
    fill,
  };
}
