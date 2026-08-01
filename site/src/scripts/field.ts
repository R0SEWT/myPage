/**
 * Vesper particle field.
 *
 * A single additive gl.POINTS draw (twice: wide halo pass, tight core pass)
 * over a buffer of N points that morph between one target shape per screen.
 *
 * The design source drove this with three.js pulled from a CDN. Everything it
 * used here is one geometry, one shader and one camera, so this is written
 * against the raw WebGL context instead: no third-party origin at runtime and
 * no renderer in the bundle. The shader body and the shape functions are
 * ported unchanged.
 */

export interface FieldOptions {
  /** Number of points. */
  count: number;
  /** Skip idle rotation and animate morphs instantly. */
  reduced?: boolean;
}

export interface Field {
  /** Morph the cloud toward the shape belonging to `index`. */
  setShape(index: number): void;
  /** Pointer position, each in [-0.5, 0.5]. */
  setPointer(x: number, y: number): void;
  /** Most recent measured frame rate. */
  fps(): number;
  count: number;
  dispose(): void;
}

const GA = 2.399963;
const MORPH_MS = 1500;

/** Deterministic per-point hash; same sequence every load. */
function rnd(i: number, s: number): number {
  const x = Math.sin(i * 127.1 + s * 311.7 + 0.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Writes the position of point `i` for `shape` into `out`.
 *
 * 0 sphere shell · 1 spiral galaxy · 2 three lobes · 3 torus
 * 4 double helix · 5 lattice cube · 6 ring with core
 */
function shapeFor(i: number, n: number, shape: number, out: number[]): void {
  const t = (i + 0.5) / n;
  const a = rnd(i, 1);
  const b = rnd(i, 2);
  const c = rnd(i, 3);
  let x = 0;
  let y = 0;
  let z = 0;

  if (shape === 0) {
    const phi = Math.acos(1 - 2 * t);
    const th = GA * i;
    const r = a < 0.07 ? 1.15 + b * 0.85 : 1.02 + (b - 0.5) * 0.13;
    x = Math.sin(phi) * Math.cos(th) * r;
    y = Math.cos(phi) * r;
    z = Math.sin(phi) * Math.sin(th) * r;
  } else if (shape === 1) {
    const arm = i % 3;
    const rr = 0.22 + Math.pow(t, 0.62) * 1.5;
    const ang = rr * 3.1 + arm * 2.094 + (b - 0.5) * 0.55;
    x = Math.cos(ang) * rr;
    y = (c - 0.5) * (0.16 + rr * 0.3);
    z = Math.sin(ang) * rr;
  } else if (shape === 2) {
    const k = i % 3;
    const phi = Math.acos(1 - 2 * a);
    const th = GA * i;
    const r = 0.5 * Math.pow(b, 0.55);
    const cx = [-1.2, 0.05, 1.18][k];
    const cy = [0.26, -0.2, 0.3][k];
    const cz = [0.1, 0.5, -0.3][k];
    x = cx + Math.sin(phi) * Math.cos(th) * r;
    y = cy + Math.cos(phi) * r * 0.82;
    z = cz + Math.sin(phi) * Math.sin(th) * r;
  } else if (shape === 3) {
    const u = t * Math.PI * 2 + (a - 0.5) * 0.05;
    const v = GA * i;
    const R = 1.08;
    const rr = 0.3 * Math.pow(b, 0.5);
    x = (R + rr * Math.cos(v)) * Math.cos(u);
    y = rr * Math.sin(v);
    z = (R + rr * Math.cos(v)) * Math.sin(u);
  } else if (shape === 4) {
    if (a < 0.16) {
      const s2 = t;
      const ang = s2 * Math.PI * 10;
      const k2 = (b - 0.5) * 2 * 0.62;
      x = Math.cos(ang) * k2;
      y = (s2 - 0.5) * 2.5;
      z = Math.sin(ang) * k2;
    } else {
      const strand = i % 2;
      const ang = t * Math.PI * 10 + strand * Math.PI;
      const rr = 0.62 + (c - 0.5) * 0.05;
      x = Math.cos(ang) * rr;
      y = (t - 0.5) * 2.5;
      z = Math.sin(ang) * rr;
    }
  } else if (shape === 5) {
    const s2 = 15;
    const ix = Math.floor(a * s2);
    const iy = Math.floor(b * s2);
    const iz = Math.floor(c * s2);
    const j = 0.018;
    x = (ix / (s2 - 1) - 0.5) * 2.2 + (rnd(i, 4) - 0.5) * j;
    y = (iy / (s2 - 1) - 0.5) * 2.2 + (rnd(i, 5) - 0.5) * j;
    z = (iz / (s2 - 1) - 0.5) * 2.2 + (rnd(i, 6) - 0.5) * j;
  } else {
    if (a < 0.34) {
      const ang = GA * i;
      const rr = 1.35 + (b - 0.5) * 0.1;
      x = Math.cos(ang) * rr;
      y = (c - 0.5) * 0.12;
      z = Math.sin(ang) * rr;
    } else {
      const phi = Math.acos(1 - 2 * b);
      const th = GA * i;
      const r = 0.46 * Math.pow(c, 0.4);
      x = Math.sin(phi) * Math.cos(th) * r;
      y = Math.cos(phi) * r;
      z = Math.sin(phi) * Math.sin(th) * r;
    }
  }

  out[0] = x;
  out[1] = y;
  out[2] = z;
}

const VERT = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uMix;
uniform float uTime;
uniform float uSize;
uniform float uPr;
varying vec3 vColor;
varying float vFade;
void main() {
  vec3 p = mix(aFrom, aTo, uMix);
  float w = 0.035 * sin(uTime * 0.55 + aSeed * 31.4);
  p += normalize(p + 0.0001) * w;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = -mv.z;
  gl_PointSize = uSize * uPr * (0.55 + 0.9 * aSeed) * (3.0 / max(0.6, d));
  float g = clamp((mv.y + 1.35) / 2.7, 0.0, 1.0);
  vColor = mix(vec3(0.44, 0.10, 1.0), vec3(0.05, 1.0, 0.48), pow(g, 0.95));
  vFade = clamp((4.9 - d) / 3.4, 0.08, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform float uAlpha;
varying vec3 vColor;
varying float vFade;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.02, r);
  // Premultiplied additive: the canvas composites over the page without a
  // second alpha multiply, so the disc falloff stays in the colour.
  float w = a * a * uAlpha * vFade;
  gl_FragColor = vec4(vColor * w, w);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
  }
  return sh;
}

/** Column-major perspective projection, matching a 46° three.js camera. */
function perspective(out: Float32Array, fovDeg: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 180 / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

/**
 * Column-major model-view for a group rotated X then Y, offset in x, viewed
 * from a camera at z = 3.5 looking down -z.
 */
function modelView(out: Float32Array, rx: number, ry: number, tx: number, camZ: number) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  out[0] = cy;
  out[1] = sx * sy;
  out[2] = -cx * sy;
  out[3] = 0;
  out[4] = 0;
  out[5] = cx;
  out[6] = sx;
  out[7] = 0;
  out[8] = sy;
  out[9] = -sx * cy;
  out[10] = cx * cy;
  out[11] = 0;
  out[12] = tx;
  out[13] = 0;
  out[14] = -camZ;
  out[15] = 1;
}

export function createField(host: HTMLElement, opts: FieldOptions): Field | null {
  const canvas = document.createElement('canvas');
  const attrs: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  };
  const gl = (canvas.getContext('webgl2', attrs) ||
    canvas.getContext('webgl', attrs)) as WebGLRenderingContext | null;
  if (!gl) return null;

  host.replaceChildren(canvas);

  const N = Math.max(2000, Math.min(200000, Math.round(opts.count)));
  const reduced = !!opts.reduced;

  /* ------------------------------------------------------------ geometry */

  const from = new Float32Array(N * 3);
  const to = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const tmp: number[] = [0, 0, 0];

  for (let i = 0; i < N; i++) {
    // Points start scattered in a tall cylinder and fly into shape 0.
    const ang = rnd(i, 9) * Math.PI * 2;
    const rr = 2.4 + rnd(i, 10) * 2.4;
    from[i * 3] = Math.cos(ang) * rr;
    from[i * 3 + 1] = (rnd(i, 11) - 0.5) * 5.2;
    from[i * 3 + 2] = Math.sin(ang) * rr;
    shapeFor(i, N, 0, tmp);
    to[i * 3] = tmp[0];
    to[i * 3 + 1] = tmp[1];
    to[i * 3 + 2] = tmp[2];
    seed[i] = rnd(i, 12);
  }

  const bufFrom = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bufFrom);
  gl.bufferData(gl.ARRAY_BUFFER, from, gl.DYNAMIC_DRAW);

  const bufTo = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bufTo);
  gl.bufferData(gl.ARRAY_BUFFER, to, gl.DYNAMIC_DRAW);

  const bufSeed = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
  gl.bufferData(gl.ARRAY_BUFFER, seed, gl.STATIC_DRAW);

  /* ------------------------------------------------------------- program */

  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || 'link failed');
    }
  } catch {
    return null;
  }
  gl.useProgram(prog);

  const aFrom = gl.getAttribLocation(prog, 'aFrom');
  const aTo = gl.getAttribLocation(prog, 'aTo');
  const aSeed = gl.getAttribLocation(prog, 'aSeed');
  const uMV = gl.getUniformLocation(prog, 'modelViewMatrix');
  const uProj = gl.getUniformLocation(prog, 'projectionMatrix');
  const uMix = gl.getUniformLocation(prog, 'uMix');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uSize = gl.getUniformLocation(prog, 'uSize');
  const uAlpha = gl.getUniformLocation(prog, 'uAlpha');
  const uPr = gl.getUniformLocation(prog, 'uPr');

  const bind = (loc: number, buf: WebGLBuffer, size: number) => {
    if (loc < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  bind(aFrom, bufFrom, 3);
  bind(aTo, bufTo, 3);
  bind(aSeed, bufSeed, 1);

  gl.disable(gl.DEPTH_TEST);
  gl.depthMask(false);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const pr = Math.min(1.8, window.devicePixelRatio || 1);
  gl.uniform1f(uPr, pr);

  /* ----------------------------------------------------------- animation */

  const proj = new Float32Array(16);
  const mv = new Float32Array(16);

  let shape = 0;
  let morphStart = performance.now();
  let mixNow = 0;
  let mx = 0;
  let my = 0;
  let px = 0;
  let raf = 0;
  let alive = true;
  let cw = 0;
  let ch = 0;

  let fpsValue = 60;
  let frames = 0;
  let acc = 0;
  let last = performance.now();
  const t0 = last;

  function resize() {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    const bw = Math.max(1, Math.round(w * pr));
    const bh = Math.max(1, Math.round(h * pr));
    if (canvas.width === bw && canvas.height === bh) return;
    canvas.width = bw;
    canvas.height = bh;
    cw = w;
    ch = h;
    gl!.viewport(0, 0, bw, bh);
    perspective(proj, 46, w / Math.max(1, h), 0.1, 40);
    gl!.uniformMatrix4fv(uProj, false, proj);
  }

  /** Bake the current interpolated positions into `from`, retarget `to`. */
  function retarget(next: number) {
    for (let i = 0; i < N * 3; i++) from[i] = from[i] + (to[i] - from[i]) * mixNow;
    for (let i = 0; i < N; i++) {
      shapeFor(i, N, next, tmp);
      to[i * 3] = tmp[0];
      to[i * 3 + 1] = tmp[1];
      to[i * 3 + 2] = tmp[2];
    }
    gl!.bindBuffer(gl!.ARRAY_BUFFER, bufFrom);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, from);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, bufTo);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, to);
    shape = next;
    morphStart = performance.now();
    mixNow = 0;
  }

  function frame() {
    if (!alive) return;
    raf = requestAnimationFrame(frame);

    const now = performance.now();
    const dt = Math.min(60, now - last);
    last = now;
    frames++;
    acc += dt;
    if (acc > 700) {
      fpsValue = Math.round((frames * 1000) / acc);
      frames = 0;
      acc = 0;
    }

    if (host.clientWidth !== cw || host.clientHeight !== ch) resize();

    const tsec = reduced ? 0 : (now - t0) / 1000;
    const raw = reduced ? 1 : Math.min(1, (now - morphStart) / MORPH_MS);
    mixNow = raw * raw * (3 - 2 * raw);

    const target = shape === 0 ? 0 : shape === 1 ? 0.1 : 0.7;
    px += (target - px) * (reduced ? 1 : 0.05);

    modelView(mv, my * 0.3, tsec * 0.075 + mx * 0.5, px + mx * 0.12, 3.5);

    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.uniformMatrix4fv(uMV, false, mv);
    gl!.uniform1f(uMix, mixNow);
    gl!.uniform1f(uTime, tsec);

    // Halo first, then the tight core on top — two passes, one buffer.
    gl!.uniform1f(uSize, 9.0);
    gl!.uniform1f(uAlpha, 0.07);
    gl!.drawArrays(gl!.POINTS, 0, N);

    gl!.uniform1f(uSize, 2.2);
    gl!.uniform1f(uAlpha, 0.8);
    gl!.drawArrays(gl!.POINTS, 0, N);
  }

  const onLost = (e: Event) => {
    e.preventDefault();
    alive = false;
    cancelAnimationFrame(raf);
  };
  canvas.addEventListener('webglcontextlost', onLost);

  resize();
  raf = requestAnimationFrame(frame);

  return {
    count: N,
    setShape(index: number) {
      if (index === shape) return;
      retarget(index);
    },
    setPointer(x: number, y: number) {
      mx = x;
      my = y;
    },
    fps: () => fpsValue,
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl!.deleteBuffer(bufFrom);
      gl!.deleteBuffer(bufTo);
      gl!.deleteBuffer(bufSeed);
      gl!.deleteProgram(prog);
      canvas.remove();
    },
  };
}
