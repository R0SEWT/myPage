import { SITE_CONFIG } from '../data/constants';

export function Footer() {
  return (
    <section className="colofon" id="colofon">
      <svg className="colofon-sigil" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
        <circle cx="60" cy="60" r="56" />
        <circle cx="60" cy="60" r="42" strokeWidth="0.5" />
        <path d="M 60 28 L 72 28 L 72 40 L 84 40 L 84 72 L 72 72 L 72 84 L 48 84 L 48 72 L 36 72 L 36 40 L 48 40 L 48 28 Z" />
        <circle cx="60" cy="60" r="6" />
        <circle cx="60" cy="60" r="2" fill="currentColor" />
      </svg>
      <h2>Correspondencia abierta.</h2>
      <p className="colofon-contact">
        <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
      </p>
      <div className="colofon-meta">
        <span>Lima · Perú · 2026</span>
        <span>Applied ML Engineer</span>
        <span>v 0.2 · {SITE_CONFIG.domain}</span>
      </div>
    </section>
  );
}
