/**
 * Vesper deck controller.
 *
 * Owns the boot sequence, the seven-screen state machine, the language
 * toggle and the stats readout, and drives the particle field and the
 * pointer trail. All content is server-rendered; this only flips state.
 */

import { createField } from './field';
import { createTrail } from './trail';
import { DENSITY } from '../data/deck';

/**
 * A wheel gesture ends when its event stream goes quiet for this long. One
 * gesture moves one screen, however long its inertial tail runs: a trackpad
 * flick keeps emitting decaying deltas for well over a second, which a fixed
 * time lock read as several gestures and skipped screens.
 */
const WHEEL_IDLE_MS = 220;
/** Longest stall an inertial tail may have and still count as one gesture. */
const WHEEL_TAIL_MS = 1200;
/** Floor between two screen changes, so a fast double flick still reads. */
const WHEEL_MIN_GAP_MS = 420;
const SWIPE_PX = 48;
/** Screen transition. Long enough to read the direction, short enough not to wait on. */
const FADE_MS = 280;
/** How far a screen travels while it fades, in px. Direction follows the nav order. */
const SHIFT_PX = 22;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function $<T extends Element = HTMLElement>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

export function initDeck() {
  const screens = Array.from(document.querySelectorAll<HTMLElement>('.screen'));
  if (!screens.length) return;

  const labels = screens.map((el) => ({
    num: el.dataset.num ?? '00',
    es: el.dataset.es ?? '',
    en: el.dataset.en ?? '',
  }));
  /** Fragment per screen ("#research"), so a screen can be linked to. */
  const slugs = labels.map((l) =>
    l.en.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  );
  const LAST = screens.length - 1;

  const pane = $<HTMLElement>('#pane');
  const stage = $<HTMLElement>('#stage');
  const trailCanvas = $<HTMLCanvasElement>('#trail');
  const sysNum = $<HTMLElement>('#sys-num');
  const langBtn = $<HTMLButtonElement>('#lang-btn');
  const more = $<HTMLButtonElement>('#more');
  const statParticles = $<HTMLElement>('#stat-particles');
  const statScreenVal = $<HTMLElement>('#stat-screen-val');
  const statScreenLabel = $<HTMLElement>('#stat-screen-label');
  const navBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-go]'));
  const pillNav = $<HTMLElement>('.pill');
  const announcer = $<HTMLElement>('#deck-announcer');

  const telemetryHud = $<HTMLElement>('#telemetry-hud');
  const hudPhase = $<HTMLElement>('#hud-phase');
  const hudPct = $<HTMLElement>('#hud-pct');
  const hudBar = $<HTMLElement>('#hud-bar');

  let screen = 0;
  let lang: 'es' | 'en' = (document.documentElement.dataset.lang as 'es' | 'en') || 'es';
  let booted = true;

  /* --------------------------------------------------------------- field */

  // 1125 rather than 900: the deck renders at a 125% root, so it hits the
  // narrow layout at a proportionally wider window. Keep in step with the
  // breakpoints in vesper.css.
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1125;
  const field = stage
    ? createField(stage, {
        count: coarse ? DENSITY.lite : DENSITY.full,
        reduced,
        onFirstFrame: () => {
          stage.classList.add('is-ready');
        },
      })
    : null;
  const trail = trailCanvas && !reduced && !coarse ? createTrail(trailCanvas) : null;

  if (statParticles) {
    statParticles.textContent = field ? `${Math.round(field.count / 1000)}k` : '—';
  }

  /* -------------------------------------------------------------- screen */

  /** Chrome that reads off the current screen. Never animates. */
  function paintChrome() {
    navBtns.forEach((b) => {
      const i = Number(b.dataset.go);
      b.setAttribute('aria-current', String(i === screen));
    });

    const l = labels[screen];
    if (sysNum) sysNum.textContent = `SYS.${l.num}`;
    if (statScreenVal) statScreenVal.textContent = `${l.num} / ${labels[LAST].num}`;
    if (statScreenLabel) statScreenLabel.textContent = lang === 'en' ? l.en : l.es;

    // On narrow screens the pill scrolls sideways; keep the current section
    // in it, or the nav stops telling you where you are.
    const active = pillNav?.querySelector<HTMLElement>('.pill-btn[aria-current="true"]');
    if (pillNav && active && pillNav.scrollWidth > pillNav.clientWidth) {
      const left = active.offsetLeft - (pillNav.clientWidth - active.offsetWidth) / 2;
      pillNav.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  /** Mark which edges of the scrolling nav pill hide more sections. */
  function paintPillEdges() {
    if (!pillNav) return;
    const max = pillNav.scrollWidth - pillNav.clientWidth;
    if (max <= 1) {
      delete pillNav.dataset.more;
      return;
    }
    const left = pillNav.scrollLeft > 2;
    const right = pillNav.scrollLeft < max - 2;
    pillNav.dataset.more = left && right ? 'both' : left ? 'left' : 'right';
  }

  /** Visible state changed without a page load, so say it to assistive tech. */
  function announce() {
    if (!announcer) return;
    const l = labels[screen];
    announcer.textContent = `${l.num} / ${labels[LAST].num} · ${lang === 'en' ? l.en : l.es}`;
  }

  function writeHash() {
    // replaceState, not pushState: Back should leave the site, not rewind the deck.
    const hash = screen === 0 ? '' : `#${slugs[screen]}`;
    if (location.hash !== hash) {
      history.replaceState(null, '', hash || location.pathname + location.search);
    }
  }

  /**
   * Swap screens with a crossfade.
   *
   * Screens share a grid cell, so the outgoing one keeps its place while it
   * fades and the incoming one fades up over it — no gap where the pane is
   * empty, and nothing outside the pane moves.
   */
  let fades: Animation[] = [];

  function settle(el: HTMLElement) {
    el.classList.remove('is-out');
    el.hidden = true;
  }

  function go(next: number) {
    const clamped = Math.max(0, Math.min(LAST, next));
    if (clamped === screen) return;

    const dir = clamped > screen ? 1 : -1;
    const from = screens[screen];
    const to = screens[clamped];
    screen = clamped;

    // A second press mid-fade must not strand the screen it interrupted.
    fades.forEach((a) => a.cancel());
    fades = [];
    screens.forEach((el) => {
      if (el !== from && el !== to) settle(el);
    });

    to.hidden = false;
    to.classList.remove('is-out');
    from.classList.add('is-out');
    if (pane) pane.scrollTop = 0;

    // Driven with the Web Animations API rather than a CSS transition: the
    // incoming screen comes off `display: none`, and a transition started in
    // the same task as the un-hide is not reliably picked up.
    if (reduced || typeof to.animate !== 'function') {
      settle(from);
    } else {
      // The screens travel along the reading axis in the direction of the nav,
      // so the deck has a place for every screen: forward is down, back is up.
      // The outgoing one leaves faster than the incoming one arrives, so the
      // two never read as competing at full strength.
      const d = dir * SHIFT_PX;
      const out = from.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: `translateY(${-d * 0.5}px)` },
        ],
        { duration: FADE_MS * 0.6, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
      );
      const inn = to.animate(
        [
          { opacity: 0, transform: `translateY(${d}px)` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: FADE_MS, delay: FADE_MS * 0.15, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      );
      fades = [inn, out];
      out.onfinish = () => {
        out.cancel();
        settle(from);
        measure();
      };
    }

    paintChrome();
    announce();
    writeHash();
    syncVideos();
    field?.setShape(screen);
    measure();
  }

  /* --------------------------------------------------------------- video */

  /**
   * Screen video plays only while its screen is showing, never under reduced
   * motion, and never again once the reader has paused it.
   */
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.screen video'));
  const userPaused = new WeakSet<HTMLVideoElement>();

  function syncVideos() {
    videos.forEach((v) => {
      const onScreen = v.closest('.screen') === screens[screen];
      if (onScreen && !reduced && !userPaused.has(v)) v.play().catch(() => {});
      else v.pause();
      paintToggle(v);
    });
  }

  function paintToggle(v: HTMLVideoElement) {
    const btn = v.parentElement?.querySelector<HTMLButtonElement>('[data-video-toggle]');
    if (!btn) return;
    const paused = v.paused || userPaused.has(v) || reduced;
    btn.classList.toggle('is-paused', paused);
    btn.setAttribute(
      'aria-label',
      paused ? (lang === 'en' ? 'Play video' : 'Reproducir video') : lang === 'en' ? 'Pause video' : 'Pausar video',
    );
  }

  videos.forEach((v) => {
    v.addEventListener('play', () => paintToggle(v));
    v.addEventListener('pause', () => paintToggle(v));
    v.parentElement?.querySelector('[data-video-toggle]')?.addEventListener('click', () => {
      if (v.paused) {
        userPaused.delete(v);
        v.play().catch(() => {});
      } else {
        userPaused.add(v);
        v.pause();
      }
    });
  });

  /* ------------------------------------------------------- overflow hint */

  let measureTimer = 0;
  function measure() {
    window.clearTimeout(measureTimer);
    measureTimer = window.setTimeout(() => {
      if (!more || !pane) return;
      const overflows = pane.scrollHeight - pane.clientHeight > 8;
      const atEnd = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 8;
      more.hidden = !(booted && overflows && !atEnd);
    }, 80);
  }

  /* ----------------------------------------------------------- languages */

  /**
   * Copy switches in CSS, but an attribute cannot — alt text and aria-labels
   * have to be written. Each such element carries the attribute name in
   * `data-i18n` and both variants in `data-es` / `data-en`.
   */
  const i18nAttrs = Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'));

  function setLang(next: 'es' | 'en') {
    lang = next;
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;

    i18nAttrs.forEach((el) => {
      const attr = el.dataset.i18n;
      const value = next === 'en' ? el.dataset.en : el.dataset.es;
      if (attr && value) el.setAttribute(attr, value);
    });
    if (langBtn) {
      langBtn.textContent = next === 'en' ? 'ES' : 'EN';
      langBtn.setAttribute(
        'aria-label',
        next === 'en' ? 'Cambiar a español' : 'Switch to English',
      );
      // The label is in the language it switches to (WCAG 3.1.2): mark it,
      // or a screen reader reads "Cambiar a español" with English phonetics.
      langBtn.setAttribute('lang', next === 'en' ? 'es' : 'en');
    }
    const l = labels[screen];
    if (statScreenLabel) statScreenLabel.textContent = next === 'en' ? l.en : l.es;
    videos.forEach(paintToggle);
    if (telemetryDone && hudPhase) {
      hudPhase.textContent = next === 'en' ? 'Online · 90k particles' : 'Online · 90k partículas';
    }
    measure();
  }

  /* ------------------------------------------------------------ telemetry */

  const telemetryPhases = {
    es: [
      { max: 35, text: 'Compilando shaders' },
      { max: 75, text: 'Montando campo GPU' },
      { max: 99, text: 'Calibrando tensores' },
      { max: 100, text: 'Online · 90k partículas' },
    ],
    en: [
      { max: 35, text: 'Compiling shaders' },
      { max: 75, text: 'Mounting GPU field' },
      { max: 99, text: 'Calibrating tensors' },
      { max: 100, text: 'Online · 90k particles' },
    ],
  };

  let telemetryDone = false;
  function markTelemetryOnline() {
    if (telemetryDone) return;
    telemetryDone = true;
    if (hudPct) hudPct.textContent = '100%';
    if (hudBar) hudBar.style.width = '100%';
    const onlineText = lang === 'en' ? 'Online · 90k particles' : 'Online · 90k partículas';
    if (hudPhase) hudPhase.textContent = onlineText;
    if (telemetryHud) telemetryHud.classList.add('is-online');
    if (stage) stage.classList.add('is-ready');
    measure();
  }

  const bootStart = performance.now();
  const TELEMETRY_MS = reduced ? 300 : 950;

  function tickTelemetry(now?: number) {
    if (telemetryDone) return;
    const currentTimestamp = typeof now === 'number' && !isNaN(now) ? now : performance.now();
    const elapsed = currentTimestamp - bootStart;
    const raw = Math.min(1, Math.max(0, elapsed / TELEMETRY_MS));
    // Harrison et al. (2007) - Accelerating power curve
    const eased = Math.pow(raw, 1.75);
    const p = Math.round(eased * 100);

    if (hudPct) hudPct.textContent = `${String(p).padStart(2, '0')}%`;
    if (hudBar) hudBar.style.width = `${p}%`;

    const activeList = telemetryPhases[lang];
    const current = activeList.find((item) => p <= item.max) || activeList[activeList.length - 1];
    if (hudPhase && current) hudPhase.textContent = current.text;

    if (raw < 1) {
      requestAnimationFrame(tickTelemetry);
    } else {
      markTelemetryOnline();
    }
  }

  requestAnimationFrame(tickTelemetry);

  /* -------------------------------------------------------------- events */

  navBtns.forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
  langBtn?.addEventListener('click', () => setLang(lang === 'en' ? 'es' : 'en'));
  more?.addEventListener('click', () => {
    if (pane) pane.scrollBy({ top: Math.round(pane.clientHeight * 0.8), behavior: 'smooth' });
  });

  /**
   * Email links copy the address alongside the navigation — the `mailto:` is
   * deliberately left to fire, so a visitor with a mail client still gets it.
   * The copy is for the case where the scheme has no registered handler and
   * the click dies silently, which is most of the ways this can go wrong.
   *
   * `navigator.clipboard` needs a secure context; on plain http the click
   * degrades to today's behaviour rather than showing a flag that lied.
   */
  document.querySelectorAll<HTMLAnchorElement>('a[data-copy]').forEach((a) => {
    const wrap = a.closest('.copy-wrap');
    let flagTimer = 0;
    a.addEventListener('click', () => {
      const value = a.dataset.copy;
      if (!value || !wrap || !navigator.clipboard) return;
      navigator.clipboard
        .writeText(value)
        .then(() => {
          wrap.classList.add('is-copied');
          window.clearTimeout(flagTimer);
          flagTimer = window.setTimeout(() => wrap.classList.remove('is-copied'), 1800);
        })
        .catch(() => {});
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    // Vertical keys read the current screen first and only turn the page at
    // its edge, the way they would on a document. Horizontal keys always turn.
    const vertical: Record<string, number> = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 };
    const v = e.key === ' ' && e.shiftKey ? -1 : vertical[e.key];
    if (v !== undefined) {
      if (tag === 'BUTTON' && e.key === ' ') return;
      e.preventDefault();
      if (pane && paneAbsorbs(v)) {
        const step = e.key.startsWith('Arrow') ? 0.25 : 0.85;
        pane.scrollBy({ top: v * Math.round(pane.clientHeight * step), behavior: reduced ? 'auto' : 'smooth' });
      } else {
        go(screen + v);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(screen + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(screen - 1);
    } else if (e.key === 'Home') {
      go(0);
    } else if (e.key === 'End') {
      go(LAST);
    }
  });

  /** True when the inner pane can still absorb scrolling in `dir`. */
  function paneAbsorbs(dir: number) {
    if (!pane || pane.scrollHeight - pane.clientHeight <= 4) return false;
    const atEnd = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2;
    const atStart = pane.scrollTop <= 2;
    return dir > 0 ? !atEnd : !atStart;
  }

  /**
   * Wheel → screen, one screen per gesture.
   *
   * A gesture is a run of wheel events with no gap longer than WHEEL_IDLE_MS.
   * It may turn the page only if it *started* with the pane already at that
   * edge: a gesture that scrolled the pane to its end is spent, and its
   * inertial tail must not carry the reader onto the next screen.
   */
  let lastWheelEvent = 0;
  let lastDelta = 0;
  let lastDeltaSigned = 0;
  let lastTurn = 0;
  let gestureUsed = false;
  let gestureMayTurn = false;
  window.addEventListener(
    'wheel',
    (e) => {
      if (!booted) return;
      const now = performance.now();
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      const mag = Math.abs(e.deltaY);
      const gap = now - lastWheelEvent;
      // Silence alone is not enough to end a gesture: on a busy main thread
      // (a slow GPU, a long frame) an inertial tail arrives in bursts with
      // gaps of hundreds of ms. Inertia has a signature, though — the deltas
      // only ever decay — so a gap followed by a *smaller* delta in the same
      // direction is still the tail. A fresh flick or a mouse notch is not.
      const tail = (mag < lastDelta * 0.98 || mag <= 2) && Math.sign(e.deltaY) === Math.sign(lastDeltaSigned) && gap < WHEEL_TAIL_MS;
      if (gap > WHEEL_IDLE_MS && !tail) {
        gestureUsed = false;
        gestureMayTurn = dir !== 0 && !paneAbsorbs(dir);
      }
      lastWheelEvent = now;
      lastDelta = mag;
      lastDeltaSigned = e.deltaY;
      if (!dir || Math.abs(e.deltaY) < 4) return;
      if (paneAbsorbs(dir)) {
        gestureMayTurn = false;
        return;
      }
      if (gestureUsed || !gestureMayTurn || now - lastTurn < WHEEL_MIN_GAP_MS) return;
      gestureUsed = true;
      lastTurn = now;
      go(screen + dir);
    },
    { passive: true },
  );

  let touchY: number | null = null;
  let touchEdge = { up: false, down: false };
  window.addEventListener(
    'touchstart',
    (e) => {
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
      // Same rule as the wheel: only a swipe that starts at an edge turns.
      touchEdge = { up: !paneAbsorbs(-1), down: !paneAbsorbs(1) };
    },
    { passive: true },
  );
  window.addEventListener(
    'touchend',
    (e) => {
      if (touchY === null || !booted) return;
      const endY = e.changedTouches[0]?.clientY ?? touchY;
      const dy = touchY - endY;
      touchY = null;
      if (Math.abs(dy) < SWIPE_PX) return;
      const dir = dy > 0 ? 1 : -1;
      if (dir > 0 ? !touchEdge.down : !touchEdge.up) return;
      go(screen + dir);
    },
    { passive: true },
  );

  window.addEventListener('pointermove', (e) => {
    field?.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    trail?.emit(e.clientX, e.clientY);
  });

  window.addEventListener('resize', measure);
  window.addEventListener('resize', paintPillEdges);
  pillNav?.addEventListener('scroll', paintPillEdges, { passive: true });
  pane?.addEventListener('scroll', measure, { passive: true });

  /* ---------------------------------------------------------------- init */

  /** Open on the screen the URL names, without a transition. */
  function fromHash() {
    const i = slugs.indexOf(location.hash.slice(1));
    if (i <= 0 || i === screen) return;
    screens[screen].hidden = true;
    screen = i;
    screens[screen].hidden = false;
  }
  window.addEventListener('hashchange', () => {
    const i = slugs.indexOf(location.hash.slice(1));
    go(i < 0 ? 0 : i);
  });

  fromHash();
  setLang(lang);
  paintPillEdges();
  syncVideos();
  paintChrome();
  field?.setShape(screen);
  measure();
}
