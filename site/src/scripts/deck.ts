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

const BOOT_MS = 1900;
const WHEEL_LOCK_MS = 700;
const SWIPE_PX = 48;
/** Content crossfade. Must match --v-fade in vesper.css. */
const FADE_MS = 200;

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
  const LAST = screens.length - 1;

  const pane = $<HTMLElement>('#pane');
  const boot = $<HTMLElement>('#boot');
  const bootPct = $<HTMLElement>('#boot-pct');
  const bootBar = $<HTMLElement>('#boot-bar');
  const stage = $<HTMLElement>('#stage');
  const trailCanvas = $<HTMLCanvasElement>('#trail');
  const sysNum = $<HTMLElement>('#sys-num');
  const langBtn = $<HTMLButtonElement>('#lang-btn');
  const more = $<HTMLButtonElement>('#more');
  const stats = $<HTMLElement>('#stats');
  const statParticles = $<HTMLElement>('#stat-particles');
  const statScreenVal = $<HTMLElement>('#stat-screen-val');
  const statScreenLabel = $<HTMLElement>('#stat-screen-label');
  const navBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-go]'));

  let screen = 0;
  let lang: 'es' | 'en' = (document.documentElement.dataset.lang as 'es' | 'en') || 'es';
  let booted = false;

  /* --------------------------------------------------------------- field */

  // 1125 rather than 900: the deck renders at a 125% root, so it hits the
  // narrow layout at a proportionally wider window. Keep in step with the
  // breakpoints in vesper.css.
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1125;
  const field = stage
    ? createField(stage, { count: coarse ? DENSITY.lite : DENSITY.full, reduced })
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
      const opts: KeyframeAnimationOptions = { duration: FADE_MS, easing: 'ease' };
      const out = from.animate([{ opacity: 1 }, { opacity: 0 }], { ...opts, fill: 'forwards' });
      fades = [to.animate([{ opacity: 0 }, { opacity: 1 }], opts), out];
      out.onfinish = () => {
        out.cancel();
        settle(from);
        measure();
      };
    }

    paintChrome();
    field?.setShape(screen);
    measure();
  }

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
    }
    const l = labels[screen];
    if (statScreenLabel) statScreenLabel.textContent = next === 'en' ? l.en : l.es;
    measure();
  }

  /* ---------------------------------------------------------------- boot */

  function finishBoot() {
    booted = true;
    if (boot) boot.hidden = true;
    if (stats) stats.hidden = false;
    measure();
  }

  const bootStart = performance.now();
  const bootDur = reduced ? 400 : BOOT_MS;
  const bootTimer = window.setInterval(() => {
    const p = Math.min(100, ((performance.now() - bootStart) / bootDur) * 100);
    const r = Math.round(p);
    if (bootPct) bootPct.textContent = String(r).padStart(3, '0');
    if (bootBar) bootBar.style.width = `${r}%`;
    if (p >= 100) {
      window.clearInterval(bootTimer);
      window.setTimeout(finishBoot, 300);
    }
  }, 60);

  /* -------------------------------------------------------------- events */

  navBtns.forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
  langBtn?.addEventListener('click', () => setLang(lang === 'en' ? 'es' : 'en'));
  more?.addEventListener('click', () => {
    if (pane) pane.scrollBy({ top: Math.round(pane.clientHeight * 0.8), behavior: 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      go(screen + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
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

  let lastWheel = 0;
  window.addEventListener(
    'wheel',
    (e) => {
      if (!booted || Math.abs(e.deltaY) < 12) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (paneAbsorbs(dir)) return;
      const now = Date.now();
      if (now - lastWheel < WHEEL_LOCK_MS) return;
      lastWheel = now;
      go(screen + dir);
    },
    { passive: true },
  );

  let touchY: number | null = null;
  window.addEventListener(
    'touchstart',
    (e) => {
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
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
      if (paneAbsorbs(dir)) return;
      go(screen + dir);
    },
    { passive: true },
  );

  window.addEventListener('pointermove', (e) => {
    field?.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    trail?.emit(e.clientX, e.clientY);
  });

  window.addEventListener('resize', measure);
  pane?.addEventListener('scroll', measure, { passive: true });

  /* ---------------------------------------------------------------- init */

  setLang(lang);
  paintChrome();
  field?.setShape(0);
  measure();
}
