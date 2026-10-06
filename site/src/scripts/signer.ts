/**
 * Field formation for the Research screen: the particles perform Imitator's
 * clip 1660 ("Hambriento"), pass through the actual architecture (nakato156/Imitator-E1),
 * enter Gemma (the LLM), and decode into the Spanish word.
 *
 * Architecture flow:
 *   sign         Real 111-keypoint skeleton from clip 1660 (7 pose, 64 face, 20+20 hands)
 *   to_imitator  Particles flow into the "IMITATOR" model block
 *   imitator     Block holds: "IMITATOR" label + 20 learned token query slots (cross-attention)
 *   to_tokens    Query slots emit the decoded subtokens
 *   tokens       Real teacher-forced subtokens with Gemma IDs:
 *                ham (1525) · brien (604) · to (14246)
 *   to_gemma     Tokens are absorbed inward into Gemma ("Gemma se los come")
 *   gemma        Block holds: "GEMMA" (LLM embedding & decoding space)
 *   to_word      Gemma decodes into the final word
 *   word         Target Spanish word: "hambriento"
 *   back         Particles dissolve and return to the signing figure
 *
 * Real data: `imitator-1660.bin` is `docs/clip_keypoints.npz` from
 * nakato156/Imitator-E1 (122 frames x 111 model-input keypoints: 7 pose,
 * 64 face, 20+20 hands, x/y in [0, 1], y down) packed as uint16.
 * Subtokens are the checkpoint's real teacher-forced output for that clip.
 */

const SRC = '/assets/deck/imitator-1660.bin';
const FRAMES = 122;
const POINTS = 111;
const FPS = 30;

const SUBTOKENS = ['ham', 'brien', 'to'];
const TOKEN_IDS = ['1525', '604', '14246'];
const WORD = 'hambriento';

// Real keypoints layout after remove_keypoints (Imitator-E1 data_augmentation.py):
// 0-6: pose (0 nose/head, 1 neck, 2 r-shoulder, 3 r-elbow, 4 r-wrist, 5 l-shoulder, 6 l-elbow)
// 7-70: face (64 facial landmarks: 4..67 of 68 in RTMPose WholeBody)
// 71-90: left hand (20 finger joints: 4 per finger)
// 91-110: right hand (20 finger joints: 4 per finger)
const LH = 71;
const RH = 91;

// Strictly the 8 real skeleton bones (no synthetic torso points):
const POSE: [number, number][] = [
  [0, 1],    // nose to neck
  [1, 2],    // neck to right shoulder
  [2, 3],    // right shoulder to elbow
  [3, 4],    // right elbow to wrist
  [4, RH],   // right wrist to right hand root
  [1, 5],    // neck to left shoulder
  [5, 6],    // left shoulder to elbow
  [6, LH],   // left elbow to left hand root
];

// Real finger chains (20 joints per hand: 5 fingers x 4 joints each)
const HAND: [number, number][] = [];
for (let f = 0; f < 5; f++) for (let j = 0; j < 3; j++) HAND.push([f * 4 + j, f * 4 + j + 1]);
for (let f = 0; f < 4; f++) HAND.push([f * 4, (f + 1) * 4]);
const FINGERS: [number, number][] = [
  ...HAND.map(([a, b]) => [LH + a, LH + b] as [number, number]),
  ...HAND.map(([a, b]) => [RH + a, RH + b] as [number, number]),
];

// Real facial landmark contours (points 7..70)
const FACE_EDGES: [number, number][] = [];
// Jawline: 7..19
for (let j = 7; j < 19; j++) FACE_EDGES.push([j, j + 1]);
// Eyebrows
for (let j = 20; j < 24; j++) FACE_EDGES.push([j, j + 1]);
for (let j = 25; j < 29; j++) FACE_EDGES.push([j, j + 1]);
// Nose
for (let j = 30; j < 33; j++) FACE_EDGES.push([j, j + 1]);
for (let j = 34; j < 38; j++) FACE_EDGES.push([j, j + 1]);
// Eyes
for (let j = 39; j < 44; j++) FACE_EDGES.push([j, j + 1]);
FACE_EDGES.push([44, 39]);
for (let j = 45; j < 50; j++) FACE_EDGES.push([j, j + 1]);
FACE_EDGES.push([50, 45]);
// Mouth
for (let j = 51; j < 62; j++) FACE_EDGES.push([j, j + 1]);
FACE_EDGES.push([62, 51]);

// Scale in world units
const SCALE = 1.6;

// Loop timing. Real sign played slightly under real speed for legibility.
const SPEED = 0.82;
const T_SIGN = FRAMES / FPS / SPEED;
const STAGES = [
  ['sign', T_SIGN],      // Seña real (111 keypoints)
  ['hold', 0.5],         // Breve pausa final
  ['to_imitator', 1.3],  // Entra al bloque Imitator
  ['imitator', 1.7],     // "IMITATOR" + 20 query slots
  ['to_tokens', 1.2],    // Queries emiten tokens
  ['tokens', 1.8],       // "ham" (1525) · "brien" (604) · "to" (14246)
  ['to_gemma', 1.2],     // Gemma absorbe ("se come") los tokens
  ['gemma', 1.6],        // Bloque "GEMMA" (espacio LLM)
  ['to_word', 1.1],      // Decodificación a la palabra final
  ['word', 2.2],         // "hambriento"
  ['back', 1.5],         // Retorno al cuerpo para reiniciar
] as const;
type Stage = (typeof STAGES)[number][0];

// Motion trails on active fingers
const LAGS = 6;
const LAG_STEP = 0.035;

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

/** Sample a centered text string into an array of world x/y particle coordinates. */
function sampleText(
  text: string,
  width: number,
  yOffset: number,
  weight = '400',
  mono = false
): Float32Array {
  const W = 1600;
  const H = 260;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const family = mono
    ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    : getComputedStyle(document.body).fontFamily || 'sans-serif';
  const size = 160;
  g.font = `${weight} ${size}px ${family}`;
  const measured = g.measureText(text).width || 1;
  const k = width / measured;

  g.clearRect(0, 0, W, H);
  g.fillStyle = '#fff';
  g.textBaseline = 'middle';
  g.textAlign = 'center';
  g.font = `${weight} ${size}px ${family}`;
  g.fillText(text, W / 2, H / 2);

  const data = g.getImageData(0, 0, W, H).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 130) {
        pts.push([(x - W / 2) * k, -(y - H / 2) * k + yOffset]);
      }
    }
  }
  return Float32Array.from(pts.flat());
}

/** Sample the subtokens and their numerical token IDs arranged in 3 columns. */
function sampleTokensWithIds(
  tokens: string[],
  ids: string[],
  totalWidth: number
): { pts: Float32Array; cx: number }[] {
  const W = 1600;
  const H = 320;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const sansFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const monoFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  g.font = `400 130px ${sansFamily}`;
  const tokenWidths = tokens.map((w) => g.measureText(w).width);
  const gap = 140;
  const sumTokens = tokenWidths.reduce((a, b) => a + b, 0) + gap * (tokens.length - 1);
  const k = totalWidth / sumTokens;

  let curLeft = -sumTokens / 2;
  return tokens.map((word, n) => {
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#fff';
    g.textAlign = 'center';

    // Subtoken text (upper)
    g.textBaseline = 'middle';
    g.font = `400 130px ${sansFamily}`;
    g.fillText(word, W / 2, H / 2 - 38);

    // Gemma token ID in mono (lower)
    g.font = `300 70px ${monoFamily}`;
    g.fillStyle = 'rgba(255, 255, 255, 0.85)';
    g.fillText(ids[n], W / 2, H / 2 + 52);

    const data = g.getImageData(0, 0, W, H).data;
    const pts: [number, number][] = [];
    const wordCenter = curLeft + tokenWidths[n] / 2;
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 120) {
          pts.push([(x - W / 2) * k + wordCenter * k, -(y - H / 2) * k]);
        }
      }
    }
    const cx = wordCenter * k;
    curLeft += tokenWidths[n] + gap;
    return { pts: Float32Array.from(pts.flat()), cx };
  });
}

export async function loadSigner(n: number): Promise<Signer> {
  const buf = await (await fetch(SRC)).arrayBuffer();
  const raw = new DataView(buf);
  const kp = new Float32Array(FRAMES * POINTS * 2);
  for (let i = 0; i < kp.length; i++) kp[i] = raw.getUint16(i * 2, true) / 65535;
  if ('fonts' in document) await document.fonts.ready;

  // Sample texts for the pipeline stages
  const imitatorText = sampleText('IMITATOR', 1.45, 0.16, '500');
  const tokenCols = sampleTokensWithIds(SUBTOKENS, TOKEN_IDS, 1.45);
  const gemmaText = sampleText('GEMMA', 1.30, 0.0, '600');
  const wordText = sampleText(WORD, 1.30, 0.0, '300');

  // Edge weights: balance motion contrast with presence of resting limbs
  const weights = (edges: [number, number][], motionBias = 0.5) => {
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
          motion += Math.hypot(
            kp[oa] + kp[ob] - kp[pa] - kp[pb],
            kp[oa + 1] + kp[ob + 1] - kp[pa + 1] - kp[pb + 1]
          );
        }
      }
      return [len / FRAMES, motion / FRAMES];
    });
    const maxMotion = Math.max(...score.map((s) => s[1])) || 1;
    const cum = new Float32Array(edges.length);
    let acc = 0;
    score.forEach(([len, motion], k) => {
      acc += len * (1 - motionBias + motionBias * (motion / maxMotion));
      cum[k] = acc;
    });
    return cum.map((c) => c / (acc || 1));
  };

  const pick = (edges: [number, number][], cum: Float32Array, r: number) => {
    let k = 0;
    while (k < cum.length - 1 && cum[k] < r) k++;
    return edges[k];
  };

  const cumFingers = weights(FINGERS, 0.5);
  const cumPose = weights(POSE, 0.35);
  const cumFace = weights(FACE_EDGES, 0.1);

  // Particle assignment arrays
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

  // Stage target buffers (N x 3)
  const formImitator = new Float32Array(n * 3);
  const formTokens = new Float32Array(n * 3);
  const formGemma = new Float32Array(n * 3);
  const formWord = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const r = rnd(i, 21);
    let k = KIND_HAZE;
    // Distribution: fingers ~20%, body ~18%, face contours ~14%, haze ~48%
    if (r < 0.20) k = KIND_FINGER;
    else if (r < 0.38) k = KIND_BODY;
    else if (r < 0.52) k = KIND_FACE;
    kind[i] = k;
    delay[i] = rnd(i, 30);
    const o = i * 3;

    if (k === KIND_HAZE) {
      // Atmospheric ambient shell
      const ang = rnd(i, 22) * Math.PI * 2;
      const rr = 0.95 + Math.pow(rnd(i, 23), 0.6) * 1.15;
      haze[o] = Math.cos(ang) * rr;
      haze[o + 1] = (rnd(i, 24) - 0.5) * 2.6;
      haze[o + 2] = Math.sin(ang) * rr * 0.6;
      continue;
    }

    if (k === KIND_FACE) {
      const e = pick(FACE_EDGES, cumFace, rnd(i, 22));
      a[i] = e[0];
      b[i] = e[1];
      t[i] = rnd(i, 23);
      const j = 0.004;
      off[o] = gauss(i, 24) * j;
      off[o + 1] = gauss(i, 27) * j;
      off[o + 2] = gauss(i, 40) * j * 1.5;
    } else {
      const e = k === KIND_FINGER ? pick(FINGERS, cumFingers, rnd(i, 22)) : pick(POSE, cumPose, rnd(i, 22));
      a[i] = e[0];
      b[i] = e[1];
      t[i] = rnd(i, 23);
      const j = k === KIND_FINGER ? 0.007 : 0.018;
      off[o] = gauss(i, 24) * j;
      off[o + 1] = gauss(i, 27) * j;
      off[o + 2] = gauss(i, 40) * j * 1.8;
      if (k === KIND_FINGER) {
        const q = rnd(i, 70);
        lag[i] = q < 0.8 ? 0 : 1 + Math.min(LAGS - 2, Math.floor(((q - 0.8) / 0.2) * (LAGS - 1)));
      }
    }

    // 1. Formation IMITATOR:
    // 60% of particles form the label "IMITATOR";
    // 40% form the 20 learned token query slots (2 rows of 10) of the Transformer cross-attention.
    const rModel = rnd(i, 51);
    if (rModel < 0.6) {
      const qp = rnd(i, 52);
      const idx = Math.min(imitatorText.length / 2 - 1, Math.floor(qp * (imitatorText.length / 2))) * 2;
      formImitator[o] = imitatorText[idx];
      formImitator[o + 1] = imitatorText[idx + 1];
      formImitator[o + 2] = gauss(i, 53) * 0.02;
    } else {
      // 20 token queries: 2 rows of 10 slots
      const qSlot = Math.floor(rnd(i, 54) * 20);
      const row = Math.floor(qSlot / 10);
      const col = qSlot % 10;
      const qx = ((col - 4.5) / 4.5) * 0.62;
      const qy = -0.06 - row * 0.15;
      const rad = 0.022;
      formImitator[o] = qx + gauss(i, 55) * rad;
      formImitator[o + 1] = qy + gauss(i, 56) * rad;
      formImitator[o + 2] = gauss(i, 57) * 0.015;
    }

    // 2. Formation TOKENS:
    // Particles form the 3 subtoken columns: ham (1525) · brien (604) · to (14246)
    const tokCol = i % 3;
    const gCol = tokenCols[tokCol];
    const qTok = rnd(i, 61);
    const gIdx = Math.min(gCol.pts.length / 2 - 1, Math.floor(qTok * (gCol.pts.length / 2))) * 2;
    formTokens[o] = gCol.pts[gIdx];
    formTokens[o + 1] = gCol.pts[gIdx + 1];
    formTokens[o + 2] = gauss(i, 62) * 0.02;

    // 3. Formation GEMMA:
    // Gemma "se come los tokens":
    // 75% form the word "GEMMA";
    // 25% form an absorbing embedding aura / ring around the model.
    const rGemma = rnd(i, 71);
    if (rGemma < 0.75) {
      const qg = rnd(i, 72);
      const gIdx = Math.min(gemmaText.length / 2 - 1, Math.floor(qg * (gemmaText.length / 2))) * 2;
      formGemma[o] = gemmaText[gIdx];
      formGemma[o + 1] = gemmaText[gIdx + 1];
      formGemma[o + 2] = gauss(i, 73) * 0.02;
    } else {
      const ang = rnd(i, 74) * Math.PI * 2;
      const radX = 0.72 + rnd(i, 75) * 0.22;
      const radY = 0.26 + rnd(i, 76) * 0.12;
      formGemma[o] = Math.cos(ang) * radX;
      formGemma[o + 1] = Math.sin(ang) * radY;
      formGemma[o + 2] = (rnd(i, 77) - 0.5) * 0.12;
    }

    // 4. Formation WORD:
    // Target Spanish word "hambriento" decoded from Gemma
    const qw = rnd(i, 81);
    const wIdx = Math.min(wordText.length / 2 - 1, Math.floor(qw * (wordText.length / 2))) * 2;
    formWord[o] = wordText[wIdx];
    formWord[o + 1] = wordText[wIdx + 1];
    formWord[o + 2] = gauss(i, 82) * 0.02;
  }

  /* Poses for signer, one per trail slot. Real 111 keypoints only. */
  const pose = new Float32Array(LAGS * POINTS * 2);
  function poseAt(time: number, slot: number) {
    const fx = clamp01(time / T_SIGN) * (FRAMES - 1);
    const f0 = Math.floor(fx);
    const f1 = Math.min(FRAMES - 1, f0 + 1);
    const u = fx - f0;
    const base = slot * POINTS * 2;
    for (let p = 0; p < POINTS; p++) {
      const o0 = (f0 * POINTS + p) * 2;
      const o1 = (f1 * POINTS + p) * 2;
      const o = base + p * 2;
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

    // Formations between which each stage moves
    const pair: Record<Stage, [Float32Array | null, Float32Array | null]> = {
      sign: [null, null],
      hold: [null, null],
      to_imitator: [null, formImitator],
      imitator: [formImitator, formImitator],
      to_tokens: [formImitator, formTokens],
      tokens: [formTokens, formTokens],
      to_gemma: [formTokens, formGemma],
      gemma: [formGemma, formGemma],
      to_word: [formGemma, formWord],
      word: [formWord, formWord],
      back: [formWord, null],
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
