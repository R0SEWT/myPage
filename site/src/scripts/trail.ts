/**
 * Pointer spark trail.
 *
 * Sparks are emitted along the segment the cursor travelled since the last
 * pointermove, then drift, fall and fade. Drawn additively on a 2D canvas
 * above the particle field but below the copy.
 *
 * Tuned down from the design source: the trail is meant to read as the room
 * answering the cursor, not as a thing in its own right. Additive blending
 * over 200-weight type at ~1s of dwell put it in front of the reader, so the
 * dwell and both alphas are cut by roughly a third.
 */

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  hue: string;
}

const MAX_SPARKS = 900;
const HUES = ['59,224,166', '139,123,255'];

/** Life burned per frame. 0.025 ≈ 0.67s at 60fps, down from ~1.05s. */
const DECAY = 0.025;
/** Peak alpha of the coloured halo and of the white core. */
const GLOW_ALPHA = 0.35;
const CORE_ALPHA = 0.45;

export interface Trail {
  emit(x: number, y: number): void;
  dispose(): void;
}

export function createTrail(canvas: HTMLCanvasElement): Trail | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const pr = Math.min(2, window.devicePixelRatio || 1);
  const sparks: Spark[] = [];
  let lastX: number | undefined;
  let lastY: number | undefined;
  let raf = 0;
  let alive = true;

  function loop() {
    if (!alive) return;
    raf = requestAnimationFrame(loop);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * pr)) {
      canvas.width = Math.round(w * pr);
      canvas.height = Math.round(h * pr);
    }

    ctx!.setTransform(pr, 0, 0, pr, 0, 0);
    ctx!.clearRect(0, 0, w, h);
    ctx!.globalCompositeOperation = 'lighter';

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= DECAY;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.012;
      s.vx *= 0.985;
      s.vy *= 0.985;

      const a = s.life * s.life;
      const g = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
      g.addColorStop(0, `rgba(${s.hue},${(GLOW_ALPHA * a).toFixed(3)})`);
      g.addColorStop(1, `rgba(${s.hue},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r * 6, 0, 6.283);
      ctx!.fill();

      ctx!.fillStyle = `rgba(255,255,255,${(CORE_ALPHA * a).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r * 0.55, 0, 6.283);
      ctx!.fill();
    }

    ctx!.globalCompositeOperation = 'source-over';
  }

  raf = requestAnimationFrame(loop);

  return {
    emit(x, y) {
      const lx = lastX;
      const ly = lastY;
      lastX = x;
      lastY = y;
      if (lx === undefined || ly === undefined) return;

      const d = Math.hypot(x - lx, y - ly);
      const n = Math.min(6, Math.round(d / 7));
      for (let i = 0; i < n; i++) {
        const t = (i + 1) / n;
        sparks.push({
          x: lx + (x - lx) * t + (Math.random() - 0.5) * 8,
          y: ly + (y - ly) * t + (Math.random() - 0.5) * 8,
          vx: (x - lx) * 0.012 + (Math.random() - 0.5) * 0.35,
          vy: (y - ly) * 0.012 + (Math.random() - 0.5) * 0.35 - 0.06,
          r: 0.7 + Math.random() * 1.7,
          life: 1,
          hue: HUES[Math.random() < 0.5 ? 0 : 1],
        });
      }
      if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(raf);
      sparks.length = 0;
    },
  };
}
