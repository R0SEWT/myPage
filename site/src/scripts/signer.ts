/**
 * Field formation for the Research screen: the particles perform Imitator's
 * clip 1660 ("Hambriento"), pass through the 3D Transformer & ML architecture
 * blocks (ST-GCN + node pooling → RoPE temporal Transformer → 20 token queries cross-attention → Gemma projection),
 * decode into teacher-forced Gemma subtokens with tokenizer IDs, and fuse into the target word.
 *
 * Grounded in the author's paper (Springer CCIS 2895 / SIMBig 2025) and PR #1 of nakato156/Imitator-E1
 * ("Redesign README explainer animation: visual clarity, ML grounding, contrast"):
 *   - Box 1: ST-GCN on 111 skeleton joints + temporal filter (k=3) + spatial mean pooling [B, T, 512]
 *   - Box 2: Temporal Transformer with rotating RoPE phase dials (Su et al. 2024) [B, T, 512]
 *   - Box 3: Cross-attention over frame sequence into 20 learned token queries + linear projection to Gemma 3072
 *   - Output stage: Real model predictions for clip 1660:
 *       Token 1: 236754 (<bos>)
 *       Token 2: 1525 (ham)
 *       Token 3: 604 (brien)
 *       Token 4: 14246 (to)
 *   - Sliding detokenizer merge into the final transcribed word: "hambriento"
 *
 * Sequence flow:
 *   sign         Real active keypoints from clip 1660: framed and centered on the
 *                signing zone (face, neck, shoulders, active right arm and hand).
 *                Inactive resting arm is omitted so the figure reads as an expressive
 *                human signer rather than a rigid pole.
 *   hold         Brief natural hold at gesture conclusion.
 *   to_boxes     Particles funnel with 3D depth into the stacked Transformer & ML architecture blocks.
 *   boxes        "Las cajitas": 3D wireframe Transformer cuboids with continuous inference wave:
 *                  [ ST-GCN & Pooling ] → [ Temporal RoPE Transformer ] → [ 20 Queries Cross-Attn & Gemma Proj ]
 *                A concentrated, hyper-visible photonic data packet travels visibly across the pipeline.
 *   to_tokens    Output projection from the model head expands into the decoded subtokens.
 *   tokens       Model output: real Gemma token IDs with subtokens:
 *                <bos> (236754) · ham (1525) · brien (604) · to (14246)
 *   merge        <bos> dissolves and the 3 subtokens slide horizontally together and fuse into the word.
 *   word         Target Spanish word: "hambriento"
 *   back         Particles dissolve and return smoothly to the signing figure.
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

// The 4 exact token predictions of the Imitator checkpoint on clip 1660 (train_temporal_v126.py / PR #1):
const SUBTOKENS = ['<bos>', 'ham', 'brien', 'to'];
const TOKEN_IDS = ['236754', '1525', '604', '14246'];
const WORD = 'hambriento';

// Real keypoints layout after remove_keypoints (Imitator-E1 data_augmentation.py):
// 0-6: pose (0 nose, 1 neck, 2 r-shoulder, 3 r-elbow, 4 r-wrist, 5 l-shoulder, 6 l-elbow)
// 7-70: face (64 facial landmarks: 4..67 of 68 in RTMPose WholeBody)
// 71-90: left hand (inactive resting hand)
// 91-110: right hand (active signing hand)
const RH = 91;

// Framing of the active signing zone:
// Centered at shoulders/neck (X = 0.48, Y = 0.31) and scaled 2.25x so the face and
// signing hand dominate the frame. The resting arm below left shoulder is omitted.
const CX = 0.48;
const CY = 0.31;
const SCALE = 2.25;

// Real active bones (neck-to-chin throat, shoulders, and active right arm):
const POSE: [number, number][] = [
  [1, 13],   // Neck to chin (clean throat connection below the face)
  [1, 2],    // Neck to right shoulder
  [2, 3],    // Right shoulder to elbow
  [3, 4],    // Right elbow to wrist
  [4, RH],   // Right wrist to right hand carpal root
  [1, 5],    // Neck to left shoulder (symmetrical shoulder cap; resting arm omitted)
];

// Active right hand structure (carpal root, metacarpal palm webbing, MCP knuckles, and 5 fingers)
const HAND_EDGES: [number, number][] = [];
// 5 fingers: 3 bone segments each (indices 0..19 relative to RH)
for (let f = 0; f < 5; f++) for (let j = 0; j < 3; j++) HAND_EDGES.push([f * 4 + j, f * 4 + j + 1]);
// Knuckle arch (MCP joints: 0 to 4, 4 to 8, 8 to 12, 12 to 16)
for (let f = 0; f < 4; f++) HAND_EDGES.push([f * 4, (f + 1) * 4]);
// Palm metacarpals from carpal root (0) to knuckles (4, 8, 12, 16)
HAND_EDGES.push([0, 4], [0, 8], [0, 12], [0, 16]);

const FINGERS: [number, number][] = HAND_EDGES.map(
  ([a, b]) => [RH + a, RH + b] as [number, number]
);

// Real facial landmark contours (points 7..70 from RTMPose WholeBody)
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

// Loop timing
const SPEED = 0.82;
const T_SIGN = FRAMES / FPS / SPEED;
const STAGES = [
  ['sign', T_SIGN],      // Seña real centrada y escalada (111 keypoints, real)
  ['hold', 0.4],         // Breve pausa final
  ['to_boxes', 1.2],     // Embudo 3D hacia las 3 cajitas del modelo
  ['boxes', 4.0],        // "Las cajitas": onda continua de inferencia ST-GCN -> RoPE -> 20 Queries -> Proyección Gemma
  ['to_tokens', 1.2],    // Apertura y proyección hacia los 4 tokens de salida del modelo
  ['tokens', 2.8],       // Salida del modelo: <bos> (236754) · ham (1525) · brien (604) · to (14246)
  ['merge', 1.4],        // <bos> se desvanece y los subtokens se deslizan y funden en la palabra
  ['word', 3.0],         // "hambriento" decodificado con dwell time completo
  ['back', 1.4],         // Retorno al cuerpo para reiniciar el ciclo
] as const;
type Stage = (typeof STAGES)[number][0];

// Motion trails on the active hand
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

/** Sample a centered text string into world x/y particle coordinates. */
function sampleText(
  text: string,
  width: number,
  yOffset: number,
  weight = '700',
  mono = false,
  xOffset = 0.0
): Float32Array {
  const W = 2048;
  const H = 340;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const family = mono
    ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    : getComputedStyle(document.body).fontFamily || 'sans-serif';
  const size = 140;
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
      if (data[(y * W + x) * 4 + 3] > 70) {
        pts.push([(x - W / 2) * k + xOffset, -(y - H / 2) * k + yOffset]);
      }
    }
  }
  return Float32Array.from(pts.flat());
}

/** Sample the 4 model output tokens and their numerical token IDs arranged in 4 columns. */
function sampleTokensWithIds(
  tokens: string[],
  ids: string[],
  totalWidth: number,
  xOffset = 0.0,
  yOffset = 0.0
): { pts: Float32Array; cx: number }[] {
  const W = 2200;
  const H = 380;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const sansFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const monoFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  const colWidths = tokens.map((w, n) => {
    g.font = n === 0 ? `700 120px ${monoFamily}` : `700 135px ${sansFamily}`;
    const tw = g.measureText(w).width;
    g.font = `700 88px ${monoFamily}`;
    const iw = g.measureText(ids[n]).width;
    return Math.max(tw, iw);
  });
  const gap = 150;
  const sumTokens = colWidths.reduce((a, b) => a + b, 0) + gap * (tokens.length - 1);
  const k = totalWidth / sumTokens;

  let curLeft = -sumTokens / 2;
  return tokens.map((word, n) => {
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#fff';
    g.textAlign = 'center';

    // Subtoken text (upper)
    g.textBaseline = 'middle';
    g.font = n === 0 ? `700 120px ${monoFamily}` : `700 135px ${sansFamily}`;
    g.fillText(word, W / 2, H / 2 - 45);

    // Gemma token ID in mono (lower)
    g.font = `700 88px ${monoFamily}`;
    g.fillStyle = '#fff';
    g.fillText(ids[n], W / 2, H / 2 + 55);

    const data = g.getImageData(0, 0, W, H).data;
    const pts: [number, number][] = [];
    const wordCenter = curLeft + colWidths[n] / 2;
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 75) {
          pts.push([(x - W / 2) * k + wordCenter * k + xOffset, -(y - H / 2) * k + yOffset]);
        }
      }
    }
    const cx = wordCenter * k + xOffset;
    curLeft += colWidths[n] + gap;
    return { pts: Float32Array.from(pts.flat()), cx };
  });
}

/** 3D Transformer architectural block description */
interface ArchBox {
  cx: number;
  cy: number;
  cz: number;
  w: number;
  h: number;
  d: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
  layerY: number[];
  edges: [number, number, number, number, number, number][]; // [x0, y0, z0, x1, y1, z1]
  vertices: [number, number, number][];
}

function createArchBox(
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  layers: number
): ArchBox {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const edges: [number, number, number, number, number, number][] = [];

  // 12 outer wireframe edges
  // Bottom rectangle
  edges.push([x0, y0, z0, x1, y0, z0], [x1, y0, z0, x1, y0, z1], [x1, y0, z1, x0, y0, z1], [x0, y0, z1, x0, y0, z0]);
  // Top rectangle
  edges.push([x0, y1, z0, x1, y1, z0], [x1, y1, z0, x1, y1, z1], [x1, y1, z1, x0, y1, z1], [x0, y1, z1, x0, y1, z0]);
  // 4 vertical corner pillars
  edges.push([x0, y0, z0, x0, y1, z0], [x1, y0, z0, x1, y1, z0], [x1, y0, z1, x1, y1, z1], [x0, y0, z1, x0, y1, z1]);

  // 8 corner vertices
  const vertices: [number, number, number][] = [
    [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
    [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1],
  ];

  // Internal layer plates
  const layerY: number[] = [];
  for (let l = 1; l <= layers; l++) {
    const yL = y0 + (h * l) / (layers + 1);
    layerY.push(yL);
    edges.push([x0, yL, z0, x1, yL, z0], [x1, yL, z0, x1, yL, z1], [x1, yL, z1, x0, yL, z1], [x0, yL, z1, x0, yL, z0]);
  }

  return { cx, cy, cz, w, h, d, x0, x1, y0, y1, z0, z1, layerY, edges, vertices };
}

export async function loadSigner(n: number): Promise<Signer> {
  // A request that never settles would leave the field waiting on the stand-in.
  const res = await fetch(SRC, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`signer: ${SRC} answered ${res.status}`);
  const buf = await res.arrayBuffer();
  const raw = new DataView(buf);
  const kp = new Float32Array(FRAMES * POINTS * 2);
  for (let i = 0; i < kp.length; i++) kp[i] = raw.getUint16(i * 2, true) / 65535;
  if ('fonts' in document) await document.fonts.ready;

  // The 4 model output tokens and final decoded word positioned in the open viewing zone
  const tokenCols = sampleTokensWithIds(SUBTOKENS, TOKEN_IDS, 1.24, 0.28, -0.04);
  const wordText = sampleText(WORD, 1.08, -0.04, '700', false, 0.28);

  // Component labels strictly grounded in the SIMBig 2025 / Springer CCIS 2895 paper:
  // Box 1: ST-GCN on 111 joints + Node Pooling into frame sequence [B, 512, T, 111] -> [B, T, 512]
  // Box 2: Transformer Encoder with Rotary Positional Embeddings (RoPE, 2 layers, 6 heads)
  // Box 3: Cross-Attention (20 Learnable Token Queries) -> Linear Projection to Gemma 3072
  const labelBox1Top = sampleText('ST-GCN', 0.36, 0.43, '800', true, -0.50);
  const labelBox1Bot = sampleText('POOLING', 0.32, -0.43, '700', true, -0.50);

  const labelBox2Top = sampleText('TRANSFORMER', 0.42, 0.45, '800', true, 0.03);
  const labelBox2Bot = sampleText('RoPE · 6 HEADS', 0.38, -0.45, '700', true, 0.03);

  const labelBox3Top = sampleText('CROSS-ATTN', 0.42, 0.48, '800', true, 0.58);
  const labelBox3Bot = sampleText('20 QUERIES', 0.36, -0.48, '700', true, 0.58);

  const allLabels = [
    { pts: labelBox1Top, boxIdx: 0 },
    { pts: labelBox1Bot, boxIdx: 0 },
    { pts: labelBox2Top, boxIdx: 1 },
    { pts: labelBox2Bot, boxIdx: 1 },
    { pts: labelBox3Top, boxIdx: 2 },
    { pts: labelBox3Bot, boxIdx: 2 },
  ];

  // Build the 3D Transformer & ML architecture boxes ("las cajitas")
  // Directly matching the modules from nakato156/Imitator-E1 PR #1:
  // Box 1: ST-GCN on 111 joints + Node Pooling into frame sequence [B, 512, T, 111] -> [B, T, 512]
  const box1 = createArchBox(-0.50, 0.0, 0.0, 0.36, 0.72, 0.22, 2);
  // Box 2: Temporal Transformer with RoPE rotating phase dials [B, T, 512]
  const box2 = createArchBox(0.03, 0.0, 0.0, 0.38, 0.76, 0.22, 3);
  // Box 3: Cross-Attention Bay (20 Learned Queries) + Linear Projection to Gemma 3072 [B, 20, 3072]
  const box3 = createArchBox(0.58, 0.0, 0.0, 0.44, 0.82, 0.24, 2);

  const archBoxes = [box1, box2, box3];
  const allWireEdges: [number, number, number, number, number, number][] = [
    ...box1.edges,
    ...box2.edges,
    ...box3.edges,
    // Horizontal dataflow bus lines connecting the boxes
    [box1.x1, 0.0, 0.0, box2.x0, 0.0, 0.0],
    [box2.x1, 0.0, 0.0, box3.x0, 0.0, 0.0],
    // Top residual bypass arches
    [box1.x1, 0.22, 0.02, box2.x0, 0.26, 0.04],
    [box2.x0, 0.26, 0.04, box2.x1, 0.26, 0.04],
    [box2.x1, 0.26, 0.04, box3.x0, 0.24, 0.02],
    // 4 Output projection beams from Box 3 towards the 4 token columns
    [box3.x1, 0.22, 0.0, box3.x1 + 0.20, 0.22, 0.05],
    [box3.x1, 0.07, 0.0, box3.x1 + 0.20, 0.07, 0.02],
    [box3.x1, -0.07, 0.0, box3.x1 + 0.20, -0.07, 0.02],
    [box3.x1, -0.22, 0.0, box3.x1 + 0.20, -0.22, 0.05],
  ];

  const allVertices: [number, number, number][] = [
    ...box1.vertices,
    ...box2.vertices,
    ...box3.vertices,
  ];

  // Box 1 ST-GCN skeleton graph nodes:
  const gcnNodes: [number, number, number][] = [
    [-0.58, 0.16, 0.02],
    [-0.62, 0.04, -0.04],
    [-0.50, 0.04, 0.05],
    [-0.54, -0.10, -0.02],
    [-0.46, -0.08, 0.06],
    [-0.38, -0.18, 0.03],
    [-0.50, -0.26, -0.05],
  ];
  const gcnEdges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [4, 5], [3, 6], [1, 6], [2, 6], [0, 3]
  ];

  // Box 2 RoPE rotating phase dial centers (Rotary Position Embedding, Su et al. 2024):
  const ropeCenters: [number, number, number][] = [
    [0.05, -0.18, 0.0],
    [0.05, 0.0, 0.0],
    [0.05, 0.18, 0.0],
  ];
  const ROPE_RADIUS = 0.068;

  // Box 3: 20 Learned Token Queries (arranged in 2 clean columns of 10):
  const querySlots: [number, number, number][] = [];
  for (let q = 0; q < 20; q++) {
    const col = q % 2;
    const row = Math.floor(q / 2); // 0..9
    const qx = 0.51 + col * 0.06;
    const qy = -0.27 + (row / 9) * 0.54;
    const qz = col === 0 ? -0.025 : 0.025;
    querySlots.push([qx, qy, qz]);
  }

  // Edge weights: length times motion
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

  const cumFingers = weights(FINGERS, 0.6);
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

  // Architecture roles inside "las cajitas":
  const ROLE_EDGE = 0;       // High-density crisp wireframe edges
  const ROLE_CORNER = 1;     // Anchored 3D corner vertices
  const ROLE_PLATE = 2;      // Internal structured layer grids
  const ROLE_GCN = 3;        // Box 1: ST-GCN spatial graph
  const ROLE_POOL = 4;       // Box 1: Mean pooling funnel
  const ROLE_ROPE = 5;       // Box 2: RoPE rotating 3D phase dials & radial needles
  const ROLE_FRAME = 6;      // Box 2: Temporal frame token sequence
  const ROLE_QUERY = 7;      // Box 3: 20 Learned Token Queries
  const ROLE_ATTN_RAY = 8;   // Box 3: Cross-Attention rays
  const ROLE_PROJ = 9;       // Box 3: Linear projection rays to Gemma 3072 & exit channels
  const ROLE_BUS = 10;       // Interconnecting data buses
  const ROLE_LABEL = 11;     // Small component labels grounded in the paper
  const ROLE_PACKET = 12;    // High-visibility traveling data packet ("recorrido de la información")

  const boxRole = new Uint8Array(n);
  const boxParamA = new Float32Array(n);
  const boxParamB = new Float32Array(n);
  const boxParamC = new Float32Array(n);
  const boxP0 = new Float32Array(n * 3);

  // Stage target buffers (N x 3)
  const formBoxes = new Float32Array(n * 3);
  const formBoxesEnd = new Float32Array(n * 3);
  const formTokens = new Float32Array(n * 3);
  const formWord = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const r = rnd(i, 21);
    let k = KIND_HAZE;
    // Distribution: active hand ~30%, face ~18%, body ~10%, atmosphere ~42%
    if (r < 0.30) k = KIND_FINGER;
    else if (r < 0.48) k = KIND_FACE;
    else if (r < 0.58) k = KIND_BODY;
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
      const j = 0.0035;
      off[o] = gauss(i, 24) * j;
      off[o + 1] = gauss(i, 27) * j;
      off[o + 2] = gauss(i, 40) * j * 1.5;
    } else {
      const e = k === KIND_FINGER ? pick(FINGERS, cumFingers, rnd(i, 22)) : pick(POSE, cumPose, rnd(i, 22));
      a[i] = e[0];
      b[i] = e[1];
      t[i] = rnd(i, 23);
      // Tight jitter on fingers so bones stay crisp and readable
      const j = k === KIND_FINGER ? 0.0035 : 0.016;
      off[o] = gauss(i, 24) * j;
      off[o + 1] = gauss(i, 27) * j;
      off[o + 2] = gauss(i, 40) * j * 1.8;
      if (k === KIND_FINGER) {
        const q = rnd(i, 70);
        lag[i] = q < 0.75 ? 0 : 1 + Math.min(LAGS - 2, Math.floor(((q - 0.75) / 0.25) * (LAGS - 1)));
      }
    }

    // Role in the 3D Transformer & ML architecture blocks ("las cajitas"):
    const rArch = rnd(i, 51);
    if (rArch < 0.16) {
      // 1. High-density wireframe edges (crisp laser struts, zero scatter)
      boxRole[i] = ROLE_EDGE;
      const edgeIdx = Math.floor(rnd(i, 52) * allWireEdges.length);
      const [ex0, ey0, ez0, ex1, ey1, ez1] = allWireEdges[edgeIdx];
      const u = rnd(i, 53);
      boxParamA[i] = edgeIdx;
      boxParamB[i] = u;
      boxP0[o] = ex0 + (ex1 - ex0) * u;
      boxP0[o + 1] = ey0 + (ey1 - ey0) * u;
      boxP0[o + 2] = ez0 + (ez1 - ez0) * u;
    } else if (rArch < 0.20) {
      // 2. Corner vertex anchors (solid 3D cuboid definition)
      boxRole[i] = ROLE_CORNER;
      const vIdx = Math.floor(rnd(i, 54) * allVertices.length);
      const [vx, vy, vz] = allVertices[vIdx];
      boxParamA[i] = vIdx;
      boxP0[o] = vx + gauss(i, 55) * 0.005;
      boxP0[o + 1] = vy + gauss(i, 56) * 0.005;
      boxP0[o + 2] = vz + gauss(i, 57) * 0.005;
    } else if (rArch < 0.26) {
      // 3. Internal structured layer plates
      boxRole[i] = ROLE_PLATE;
      const box = archBoxes[Math.floor(rnd(i, 58) * archBoxes.length)];
      const ly = box.layerY[Math.floor(rnd(i, 59) * box.layerY.length)];
      boxP0[o] = box.x0 + rnd(i, 60) * box.w;
      boxP0[o + 1] = ly + gauss(i, 61) * 0.002;
      boxP0[o + 2] = box.z0 + rnd(i, 62) * box.d;
    } else if (rArch < 0.32) {
      // 4. Box 1: ST-GCN spatial skeleton graph (nodes + edges + time conv)
      boxRole[i] = ROLE_GCN;
      const eIdx = Math.floor(rnd(i, 63) * gcnEdges.length);
      boxParamA[i] = gcnEdges[eIdx][0];
      boxParamB[i] = gcnEdges[eIdx][1];
      boxParamC[i] = rnd(i, 64);
      const na = gcnNodes[gcnEdges[eIdx][0]];
      const nb = gcnNodes[gcnEdges[eIdx][1]];
      const u = boxParamC[i];
      boxP0[o] = na[0] + (nb[0] - na[0]) * u;
      boxP0[o + 1] = na[1] + (nb[1] - na[1]) * u;
      boxP0[o + 2] = na[2] + (nb[2] - na[2]) * u;
    } else if (rArch < 0.37) {
      // 5. Box 1: Mean pooling funnel (111 nodes collapsing into bus)
      boxRole[i] = ROLE_POOL;
      boxP0[o] = box1.x0 + 0.04 + rnd(i, 65) * (box1.w - 0.08);
      boxP0[o + 1] = (rnd(i, 66) - 0.5) * 0.48;
      boxP0[o + 2] = (rnd(i, 67) - 0.5) * 0.16;
    } else if (rArch < 0.45) {
      // 6. Box 2: RoPE rotating 3D phase dials & radial needles
      boxRole[i] = ROLE_ROPE;
      const dialIdx = Math.floor(rnd(i, 68) * ropeCenters.length);
      boxParamA[i] = dialIdx;
      boxParamB[i] = rnd(i, 69) * Math.PI * 2;
      boxParamC[i] = rnd(i, 70) < 0.25 ? 1 : 0; // needle flag
      const dc = ropeCenters[dialIdx];
      const ang = boxParamB[i];
      const r_dial = boxParamC[i] ? rnd(i, 71) * ROPE_RADIUS : ROPE_RADIUS;
      boxP0[o] = dc[0] + Math.cos(ang) * r_dial;
      boxP0[o + 1] = dc[1] + Math.sin(ang) * r_dial;
      boxP0[o + 2] = dc[2] + Math.sin(ang * 2) * 0.012;
    } else if (rArch < 0.50) {
      // 7. Box 2: Temporal frame token stack
      boxRole[i] = ROLE_FRAME;
      const frameIdx = Math.floor(rnd(i, 72) * 6);
      boxParamA[i] = frameIdx;
      const fy = -0.25 + (frameIdx / 5) * 0.50;
      boxP0[o] = -0.08 + (rnd(i, 73) - 0.5) * 0.07;
      boxP0[o + 1] = fy + (rnd(i, 74) - 0.5) * 0.02;
      boxP0[o + 2] = (rnd(i, 75) - 0.5) * 0.04;
    } else if (rArch < 0.57) {
      // 8. Box 3: 20 Learned Token Queries
      boxRole[i] = ROLE_QUERY;
      const qIdx = Math.floor(rnd(i, 76) * 20);
      boxParamA[i] = qIdx;
      boxP0[o] = gauss(i, 77);
      boxP0[o + 1] = gauss(i, 78);
      boxP0[o + 2] = gauss(i, 79);
    } else if (rArch < 0.62) {
      // 9. Box 3: Cross-Attention rays
      boxRole[i] = ROLE_ATTN_RAY;
      boxParamA[i] = Math.floor(rnd(i, 80) * 20); // target query
      boxParamB[i] = Math.floor(rnd(i, 81) * 6);  // source frame
      boxParamC[i] = rnd(i, 82);                  // ray prog offset
      const qs = querySlots[Math.floor(boxParamA[i])];
      const fy = -0.28 + (boxParamB[i] / 5) * 0.56;
      boxP0[o] = 0.36 + (qs[0] - 0.36) * boxParamC[i];
      boxP0[o + 1] = fy + (qs[1] - fy) * boxParamC[i];
      boxP0[o + 2] = qs[2] * boxParamC[i];
    } else if (rArch < 0.66) {
      // 10. Box 3: Linear projection rays to Gemma 3072 & 4 exit channels
      boxRole[i] = ROLE_PROJ;
      boxParamA[i] = Math.floor(rnd(i, 83) * 4); // 4 exit channels
      boxParamB[i] = rnd(i, 84);
      const targetY = [0.22, 0.07, -0.07, -0.22][Math.floor(boxParamA[i])];
      boxP0[o] = 0.58 + boxParamB[i] * 0.22;
      boxP0[o + 1] = targetY * boxParamB[i];
      boxP0[o + 2] = 0.0;
    } else if (rArch < 0.70) {
      // 11. Interconnecting buses
      boxRole[i] = ROLE_BUS;
      boxParamA[i] = Math.floor(rnd(i, 85) * 3);
      boxParamB[i] = rnd(i, 86);
      boxParamC[i] = rnd(i, 87);
      if (boxParamA[i] === 0) {
        boxP0[o] = -0.32 + boxParamB[i] * 0.16;
        boxP0[o + 1] = 0.0;
        boxP0[o + 2] = (boxParamC[i] - 0.5) * 0.04;
      } else if (boxParamA[i] === 1) {
        boxP0[o] = 0.22 + boxParamB[i] * 0.14;
        boxP0[o + 1] = 0.0;
        boxP0[o + 2] = (boxParamC[i] - 0.5) * 0.04;
      } else {
        const u = boxParamB[i];
        boxP0[o] = -0.16 + u * 0.38;
        boxP0[o + 1] = 0.38 + Math.sin(u * Math.PI) * 0.08;
        boxP0[o + 2] = 0.04;
      }
    } else if (rArch < 0.88) {
      // 12. Component text labels from paper: Dedicated ~18% of particles for dense, bold letterforms
      boxRole[i] = ROLE_LABEL;
      const lIdx = i % allLabels.length;
      const lbl = allLabels[lIdx];
      const pIdx = Math.min(lbl.pts.length / 2 - 1, Math.floor(rnd(i, 88) * (lbl.pts.length / 2))) * 2;
      boxParamA[i] = lbl.boxIdx;
      boxP0[o] = lbl.pts[pIdx];
      boxP0[o + 1] = lbl.pts[pIdx + 1];
      boxP0[o + 2] = 0.14; // Bring forward for maximum point size & bright bloom
    } else {
      // 13. Hyper-visible splitting & merging photonic data swarm ("partirse y juntarse")
      boxRole[i] = ROLE_PACKET;
      boxParamA[i] = rnd(i, 88); // branch / query index (0..19)
      boxParamB[i] = rnd(i, 89); // core vs corona vs tail (0..1)
      boxParamC[i] = rnd(i, 90); // phase offset
      boxP0[o] = -0.50;
      boxP0[o + 1] = 0.0;
      boxP0[o + 2] = 0.0;
    }

    // Formation TOKENS:
    // Particles form the 4 model output columns: <bos> (236754) · ham (1525) · brien (604) · to (14246)
    const tokCol = i % 4;
    const gCol = tokenCols[tokCol];
    const qTok = rnd(i, 91);
    const gIdx = Math.min(gCol.pts.length / 2 - 1, Math.floor(qTok * (gCol.pts.length / 2))) * 2;
    formTokens[o] = gCol.pts[gIdx];
    formTokens[o + 1] = gCol.pts[gIdx + 1];
    formTokens[o + 2] = 0.14 + gauss(i, 92) * 0.01;

    // Formation WORD:
    // Target Spanish word "hambriento" decoded from the subtokens:
    // Tokens 1, 2, 3 (ham, brien, to) slide into the 3 thirds of "hambriento"
    // Token 0 (<bos>) softly dissolves into the ambient haze.
    if (tokCol === 0) {
      // Dissolve <bos> into subtle outer field
      const ang = rnd(i, 93) * Math.PI * 2;
      const rr = 1.1 + rnd(i, 94) * 0.5;
      formWord[o] = Math.cos(ang) * rr;
      formWord[o + 1] = (rnd(i, 95) - 0.5) * 1.8;
      formWord[o + 2] = Math.sin(ang) * rr * 0.5;
    } else {
      const qw = rnd(i, 96);
      const wIdx = Math.min(wordText.length / 2 - 1, Math.floor(qw * (wordText.length / 2))) * 2;
      formWord[o] = wordText[wIdx];
      formWord[o + 1] = wordText[wIdx + 1];
      formWord[o + 2] = 0.16 + gauss(i, 97) * 0.01;
    }
  }

  // Evaluates the dynamic positions of particles inside "las cajitas"
  function evalBoxes(dst: Float32Array, pProg: number, tNow: number) {
    const wave = pProg * 4.2;            // sweeps 0.0 -> 4.2
    const waveX = -0.78 + pProg * 1.48;  // sweeps along X: -0.78 -> +0.70

    for (let i = 0; i < n; i++) {
      if (kind[i] === KIND_HAZE) continue;
      const o = i * 3;
      const r = boxRole[i];

      if (r === ROLE_EDGE) {
        const bx = boxP0[o], by = boxP0[o + 1], bz = boxP0[o + 2];
        const dist = Math.abs(bx - waveX);
        const glow = Math.max(0, 1 - dist / 0.22);
        dst[o] = bx;
        dst[o + 1] = by + Math.sin(tNow * 12 + bx * 20) * 0.002 * glow;
        dst[o + 2] = bz + glow * 0.05;
      } else if (r === ROLE_CORNER) {
        // Vertex hubs anchor the 3D cuboid
        const bx = boxP0[o], by = boxP0[o + 1], bz = boxP0[o + 2];
        const dist = Math.abs(bx - waveX);
        const glow = Math.max(0, 1 - dist / 0.25);
        dst[o] = bx;
        dst[o + 1] = by;
        dst[o + 2] = bz + glow * 0.06;
      } else if (r === ROLE_PLATE) {
        const bx = boxP0[o], by = boxP0[o + 1], bz = boxP0[o + 2];
        const dist = Math.abs(bx - waveX);
        const glow = Math.max(0, 1 - dist / 0.20);
        dst[o] = bx;
        dst[o + 1] = by + Math.sin(tNow * 8 + bx * 15) * 0.0018 * glow;
        dst[o + 2] = bz + glow * 0.04;
      } else if (r === ROLE_GCN) {
        // Spatial graph node/edge pulse in Box 1
        const act = Math.max(0, 1 - Math.abs(wave - 0.7) / 0.7);
        const na = gcnNodes[Math.floor(boxParamA[i])];
        const nb = gcnNodes[Math.floor(boxParamB[i])];
        const u = (boxParamC[i] + tNow * 0.6 * (0.3 + 0.7 * act)) % 1.0;
        const pulse = Math.sin(tNow * 8 + boxParamA[i] * 2.0) * 0.010 * act;
        dst[o] = na[0] + (nb[0] - na[0]) * u;
        dst[o + 1] = na[1] + (nb[1] - na[1]) * u + pulse;
        dst[o + 2] = na[2] + (nb[2] - na[2]) * u + act * 0.05;
      } else if (r === ROLE_POOL) {
        // Mean pooling over 111 nodes: funnel collapses into Box 1 exit
        const collapse = Math.min(1, Math.max(0, (wave - 0.5) / 0.8));
        const ce = collapse * collapse * (3 - 2 * collapse);
        const sx = boxP0[o], sy = boxP0[o + 1], sz = boxP0[o + 2];
        const tx = -0.32, ty = 0.0, tz = 0.0;
        dst[o] = sx + (tx - sx) * ce;
        dst[o + 1] = sy + (ty - sy) * ce;
        dst[o + 2] = sz + (tz - sz) * ce + ce * 0.04;
      } else if (r === ROLE_ROPE) {
        // Rotating 3D phase dials & radial needles in Box 2
        const dialIdx = Math.floor(boxParamA[i]);
        const dc = ropeCenters[dialIdx];
        const isNeedle = boxParamC[i] > 0.5;
        const inBox2 = Math.max(0, 1 - Math.abs(wave - 1.8) / 0.7);
        const spin = wave * (4.2 + inBox2 * 3.5) + dialIdx * 2.094 + tNow * (1.2 + inBox2 * 1.5);
        const ang = boxParamB[i] + spin;
        const r_dial = isNeedle ? ((boxParamB[i] % 1.0) * ROPE_RADIUS) : ROPE_RADIUS;
        dst[o] = dc[0] + Math.cos(ang) * r_dial;
        dst[o + 1] = dc[1] + Math.sin(ang) * r_dial;
        dst[o + 2] = dc[2] + Math.sin(ang * 2) * 0.015 + inBox2 * 0.05;
      } else if (r === ROLE_FRAME) {
        // Temporal frame token stack in Box 2
        const frameIdx = Math.floor(boxParamA[i]);
        const act = Math.max(0, 1 - Math.abs(wave - (1.1 + frameIdx * 0.18)) / 0.28);
        dst[o] = boxP0[o];
        dst[o + 1] = boxP0[o + 1] + Math.sin(tNow * 10 + frameIdx) * 0.005 * act;
        dst[o + 2] = boxP0[o + 2] + act * 0.04;
      } else if (r === ROLE_QUERY) {
        // 20 Learned Token Queries in Box 3
        const qIdx = Math.floor(boxParamA[i]);
        const qs = querySlots[qIdx];
        const col = qIdx % 2;
        const row = Math.floor(qIdx / 2);
        const qHit = Math.max(0, 1 - Math.abs(wave - (2.1 + row * 0.10 + col * 0.05)) / 0.35);
        const rad = 0.013 * (1.0 + 0.65 * qHit);
        dst[o] = qs[0] + boxP0[o] * rad;
        dst[o + 1] = qs[1] + boxP0[o + 1] * rad;
        dst[o + 2] = qs[2] + boxP0[o + 2] * rad + qHit * 0.06;
      } else if (r === ROLE_ATTN_RAY) {
        // Dynamic cross-attention rays sweeping frames -> queries
        const qIdx = Math.floor(boxParamA[i]);
        const qs = querySlots[qIdx];
        const fy = -0.28 + (boxParamB[i] / 5) * 0.56;
        const fx = 0.36, fz = 0.0;
        const rayProg = (boxParamC[i] + tNow * 1.8) % 1.0;
        const inAttn = Math.max(0, 1 - Math.abs(wave - 2.8) / 0.9);
        dst[o] = fx + (qs[0] - fx) * rayProg;
        dst[o + 1] = fy + (qs[1] - fy) * rayProg;
        dst[o + 2] = fz + (qs[2] - fz) * rayProg + inAttn * 0.04;
      } else if (r === ROLE_PROJ) {
        // Linear projection beams from queries through Gemma 3072 plates to 4 exit channels
        const channel = Math.floor(boxParamA[i]);
        const targetY = [0.22, 0.07, -0.07, -0.22][channel];
        const prog = (boxParamB[i] + Math.max(0, wave - 2.8) * 0.8 + tNow * 0.8) % 1.0;
        const sx = 0.58, sy = targetY * 0.5, sz = 0.0;
        const tx = 0.80, ty = targetY, tz = 0.0;
        const inProj = Math.max(0, 1 - Math.abs(wave - 3.5) / 0.7);
        dst[o] = sx + (tx - sx) * prog;
        dst[o + 1] = sy + (ty - sy) * prog;
        dst[o + 2] = sz + (tz - sz) * prog + inProj * 0.05;
      } else if (r === ROLE_BUS) {
        // Interconnecting data buses
        const busIdx = Math.floor(boxParamA[i]);
        if (busIdx === 0) {
          const u = (boxParamB[i] + tNow * 1.4) % 1.0;
          const act = Math.max(0, 1 - Math.abs(wave - 1.25) / 0.4);
          dst[o] = -0.32 + u * 0.16;
          dst[o + 1] = 0.0;
          dst[o + 2] = (boxParamC[i] - 0.5) * 0.03 + act * 0.04;
        } else if (busIdx === 1) {
          const u = (boxParamB[i] + tNow * 1.4) % 1.0;
          const act = Math.max(0, 1 - Math.abs(wave - 2.7) / 0.4);
          dst[o] = 0.22 + u * 0.14;
          dst[o + 1] = 0.0;
          dst[o + 2] = (boxParamC[i] - 0.5) * 0.03 + act * 0.04;
        } else {
          dst[o] = boxP0[o];
          dst[o + 1] = boxP0[o + 1];
          dst[o + 2] = boxP0[o + 2];
        }
      } else if (r === ROLE_LABEL) {
        // Component text labels from paper: rock-solid, sharp, maximum legibility
        const bIdx = boxParamA[i];
        const bCenterWave = bIdx === 0 ? 0.7 : (bIdx === 1 ? 1.8 : 3.2);
        const act = Math.max(0, 1 - Math.abs(wave - bCenterWave) / 0.8);
        dst[o] = boxP0[o];
        dst[o + 1] = boxP0[o + 1];
        dst[o + 2] = 0.16 + act * 0.03;
      } else {
        // 13. Hyper-visible splitting & merging photonic data swarm ("partirse y juntarse")
        const branch20 = Math.floor(boxParamA[i] * 20); // 0..19
        const isCore = boxParamB[i] < 0.52;             // 52% core (super-bright white-cyan)
        const isCorona = boxParamB[i] >= 0.52 && boxParamB[i] < 0.86; // 34% corona halo
        const isTail = boxParamB[i] >= 0.86;            // 14% comet tail

        // Radius of particle offset from branch center line
        const rOff = isCore ? 0.0035 * (boxParamC[i] * 0.8 + 0.2) : (isCorona ? 0.014 * (boxParamC[i] * 0.8 + 0.2) : 0.024);
        const ang = boxParamC[i] * Math.PI * 2 + tNow * 12;
        const jx = Math.cos(ang) * rOff;
        const jy = Math.sin(ang) * rOff;
        // Bring core particles closer to camera in Z for huge gl_PointSize & maximum alpha bloom:
        const jz = isCore ? 0.14 : (isCorona ? 0.08 : 0.02);

        // Splitting and re-joining trajectory:
        let px = -0.50, py = 0.0, pz = 0.0;

        if (wave < 0.30) {
          // 1a. Entrada unificada desde la seña
          const u = wave / 0.30;
          px = -0.70 + u * 0.12;
          py = 0.0;
          pz = 0.06;
        } else if (wave < 0.75) {
          // 1b. SE PARTE en 5 ramas del grafo ST-GCN
          const b5 = branch20 % 5;
          const u = (wave - 0.30) / 0.45;
          const targetNode = gcnNodes[b5];
          const startX = -0.58, startY = 0.0, startZ = 0.06;
          px = startX + u * (targetNode[0] - startX);
          py = startY + u * (targetNode[1] - startY);
          pz = startZ + u * (targetNode[2] - startZ);
        } else if (wave < 1.05) {
          // 1c. SE JUNTA en el cono de pooling de salida de Box 1
          const b5 = branch20 % 5;
          const u = (wave - 0.75) / 0.30;
          const ue = u * u * (3 - 2 * u);
          const fromNode = gcnNodes[b5];
          const exit1X = -0.32, exit1Y = 0.0, exit1Z = 0.08;
          px = fromNode[0] + ue * (exit1X - fromNode[0]);
          py = fromNode[1] + ue * (exit1Y - fromNode[1]);
          pz = fromNode[2] + ue * (exit1Z - fromNode[2]);
        } else if (wave < 1.45) {
          // 2. UNIFICADO: Disparo por Bus 1 a alta velocidad
          const u = (wave - 1.05) / 0.40;
          px = -0.32 + u * 0.18;
          py = 0.0;
          pz = 0.10;
        } else if (wave < 2.15) {
          // 3a. SE PARTE en Box 2: 3 diales de RoPE + arco residual superior
          const m4 = branch20 % 4;
          if (m4 < 3) {
            // Orbita en dial RoPE m4
            const dc = ropeCenters[m4];
            const spin = wave * 6.5 + m4 * 2.094 + boxParamC[i] * 6.28;
            px = dc[0] + Math.cos(spin) * ROPE_RADIUS;
            py = dc[1] + Math.sin(spin) * ROPE_RADIUS;
            pz = dc[2] + Math.sin(spin * 2) * 0.015 + 0.08;
          } else {
            // Flujo por el arco residual superior
            const uArch = (wave - 1.45) / 0.70;
            px = -0.14 + uArch * 0.36;
            py = 0.38 + Math.sin(uArch * Math.PI) * 0.10;
            pz = 0.08;
          }
        } else if (wave < 2.50) {
          // 3b. SE JUNTA en la salida de Box 2 (LayerNorm & residual add)
          const m4 = branch20 % 4;
          const u = (wave - 2.15) / 0.35;
          const ue = u * u * (3 - 2 * u);
          let sx = 0.03, sy = 0.0, sz = 0.08;
          if (m4 < 3) {
            const dc = ropeCenters[m4];
            sx = dc[0]; sy = dc[1]; sz = dc[2] + 0.08;
          } else {
            sx = 0.18; sy = 0.38; sz = 0.08;
          }
          const exit2X = 0.22, exit2Y = 0.0, exit2Z = 0.10;
          px = sx + ue * (exit2X - sx);
          py = sy + ue * (exit2Y - sy);
          pz = sz + ue * (exit2Z - sz);
        } else if (wave < 2.90) {
          // 4. UNIFICADO: Disparo por Bus 2 a alta velocidad
          const u = (wave - 2.50) / 0.40;
          px = 0.22 + u * 0.16;
          py = 0.0;
          pz = 0.10;
        } else if (wave < 3.45) {
          // 5a. SE PARTE EN 20 RAYOS PARALELOS hacia las 20 queries
          const u = (wave - 2.90) / 0.55;
          const qTarget = querySlots[branch20];
          const startX = 0.38, startY = 0.0, startZ = 0.08;
          px = startX + u * (qTarget[0] - startX);
          py = startY + u * (qTarget[1] - startY);
          pz = startZ + u * (qTarget[2] - startZ);
        } else if (wave < 3.80) {
          // 5b. SE JUNTA EN 4 CANALES en la proyección de Gemma 3072
          const ch4 = branch20 % 4;
          const targetY = [0.22, 0.07, -0.07, -0.22][ch4];
          const u = (wave - 3.45) / 0.35;
          const ue = u * u * (3 - 2 * u);
          const qSource = querySlots[branch20];
          px = qSource[0] + ue * (0.78 - qSource[0]);
          py = qSource[1] + ue * (targetY - qSource[1]);
          pz = 0.10;
        } else {
          // 6. SE PARTE EN 4 HACES LÁSER disparando hacia los 4 tokens
          const ch4 = branch20 % 4;
          const targetY = [0.22, 0.07, -0.07, -0.22][ch4];
          const u = (wave - 3.80) / 0.40;
          px = 0.78 + u * 0.22;
          py = targetY;
          pz = 0.10;
        }

        // Tail spark lag
        const lagX = isTail ? -0.05 * (boxParamC[i] * 0.7 + 0.3) : 0.0;

        dst[o] = px + jx + lagX;
        dst[o + 1] = py + jy;
        dst[o + 2] = pz + jz;
      }
    }
  }

  // Precompute initial base state (p = 0) and final end state (p = 1) for seamless transitions
  evalBoxes(formBoxes, 0.0, 0.0);
  evalBoxes(formBoxesEnd, 1.0, 3.8);

  /* Poses for signer, one per trail slot. Real keypoints centered on CX, CY. */
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
      pose[o] = (kp[o0] + (kp[o1] - kp[o0]) * u - CX) * SCALE;
      pose[o + 1] = -(kp[o0 + 1] + (kp[o1 + 1] - kp[o0 + 1]) * u - CY) * SCALE;
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

    // Dynamic processing during the architecture stage:
    if (stage === 'boxes') {
      evalBoxes(out, p, time);
      for (let i = 0; i < n; i++) {
        if (kind[i] === KIND_HAZE) {
          const o = i * 3;
          out[o] = haze[o];
          out[o + 1] = haze[o + 1];
          out[o + 2] = haze[o + 2];
        }
      }
      return;
    }

    // Formations between which each stage moves
    const pair: Record<Stage, [Float32Array | null, Float32Array | null]> = {
      sign: [null, null],
      hold: [null, null],
      to_boxes: [null, formBoxes],
      boxes: [formBoxes, formBoxes],
      to_tokens: [formBoxesEnd, formTokens],
      tokens: [formTokens, formTokens],
      merge: [formTokens, formWord],
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

      // Dynamic trajectory funnels
      if (stage === 'to_boxes') {
        // Particles from the sign flow and converge into the 3D Transformer boxes
        const arc = Math.sin(e * Math.PI);
        out[o] = fx + (tx - fx) * e + arc * (tx - fx) * 0.12;
        out[o + 1] = fy + (ty - fy) * e + arc * 0.06;
        out[o + 2] = fz + (tzv - fz) * e - arc * 0.24;
        continue;
      }

      if (stage === 'to_tokens') {
        // Architecture unbinds and projects forward into the 4 model output tokens
        const arc = Math.sin(e * Math.PI);
        out[o] = fx + (tx - fx) * e + arc * 0.03 * (rnd(i, 44) - 0.5);
        out[o + 1] = fy + (ty - fy) * e + arc * 0.04 * (rnd(i, 45) - 0.5);
        out[o + 2] = fz + (tzv - fz) * e + arc * 0.12;
        continue;
      }

      if (stage === 'merge') {
        // Subtokens slide horizontally and condense into the word
        const arc = Math.sin(e * Math.PI);
        out[o] = fx + (tx - fx) * e;
        out[o + 1] = fy + (ty - fy) * e;
        out[o + 2] = fz + (tzv - fz) * e - arc * 0.12;
        continue;
      }

      if (stage === 'back') {
        // "hambriento" softly dematerializes and returns into the signing figure
        const arc = Math.sin(e * Math.PI);
        out[o] = fx + (tx - fx) * e - arc * 0.08 * (rnd(i, 46) - 0.5);
        out[o + 1] = fy + (ty - fy) * e + arc * 0.08;
        out[o + 2] = fz + (tzv - fz) * e - arc * 0.15;
        continue;
      }

      out[o] = fx + (tx - fx) * e;
      out[o + 1] = fy + (ty - fy) * e;
      out[o + 2] = fz + (tzv - fz) * e;
    }
  }

  return { cycle, still: T_SIGN * 0.5, fill };
}
