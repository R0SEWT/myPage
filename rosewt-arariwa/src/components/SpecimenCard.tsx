import type { ReactElement } from 'react';
import type { Specimen, SpecimenStatus } from '../data/constants';

function statusClass(s: SpecimenStatus) {
  if (s === 'Publicado' || s === 'Demo activa') return 'active';
  if (s === 'Restringido') return 'restricted';
  return 'research';
}

const SIGILS: Record<string, ReactElement> = {
  'SYS·001': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
      <circle cx="40" cy="40" r="36" />
      <circle cx="40" cy="40" r="24" />
      <circle cx="40" cy="40" r="12" />
      <circle cx="40" cy="8" r="2" fill="currentColor" />
      <circle cx="72" cy="40" r="2" fill="currentColor" />
      <circle cx="40" cy="72" r="2" fill="currentColor" />
      <circle cx="8" cy="40" r="2" fill="currentColor" />
      <line x1="40" y1="8" x2="72" y2="40" />
      <line x1="72" y1="40" x2="40" y2="72" />
      <line x1="40" y1="72" x2="8" y2="40" />
      <line x1="8" y1="40" x2="40" y2="8" />
    </svg>
  ),
  'SYS·002': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
      <circle cx="40" cy="40" r="36" />
      <rect x="20" y="20" width="40" height="40" strokeWidth="0.7" />
      <rect x="28" y="28" width="24" height="24" strokeWidth="0.5" />
      <line x1="20" y1="30" x2="60" y2="30" strokeWidth="0.3" />
      <line x1="20" y1="40" x2="60" y2="40" strokeWidth="0.3" />
      <line x1="20" y1="50" x2="60" y2="50" strokeWidth="0.3" />
      <circle cx="40" cy="40" r="3" fill="currentColor" />
    </svg>
  ),
  'SYS·003': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
      <circle cx="40" cy="40" r="36" />
      <circle cx="40" cy="18" r="3" />
      <circle cx="24" cy="40" r="3" />
      <circle cx="56" cy="40" r="3" />
      <circle cx="16" cy="60" r="3" />
      <circle cx="32" cy="60" r="3" />
      <circle cx="48" cy="60" r="3" />
      <circle cx="64" cy="60" r="3" />
      <line x1="40" y1="21" x2="24" y2="37" />
      <line x1="40" y1="21" x2="56" y2="37" />
      <line x1="24" y1="43" x2="16" y2="57" />
      <line x1="24" y1="43" x2="32" y2="57" />
      <line x1="56" y1="43" x2="48" y2="57" />
      <line x1="56" y1="43" x2="64" y2="57" />
    </svg>
  ),
  'SYS·004': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
      <circle cx="40" cy="40" r="36" />
      <path d="M 12 40 Q 20 20 28 40 Q 36 60 44 40 Q 52 20 60 40 Q 68 60 68 40" strokeWidth="1.2" />
      <circle cx="40" cy="40" r="4" fill="currentColor" />
      <line x1="40" y1="12" x2="40" y2="68" strokeWidth="0.3" />
    </svg>
  ),
};

interface SpecimenCardProps {
  specimen: Specimen;
}

export function SpecimenCard({ specimen }: SpecimenCardProps) {
  const { code, yearRange, status, title, subtitle, summary, tags, venue, stack, metric, url } = specimen;
  const sigil = SIGILS[code] ?? SIGILS['SYS·001'];

  const inner = (
    <>
      <div className="specimen-id">
        <span className="code">{code}</span>
        <span className="year">{yearRange}</span>
        <span className={`status ${statusClass(status)}`}>{status}</span>
      </div>

      <div className="specimen-body">
        <h3>{title}</h3>
        <p className="specimen-subtitle">{subtitle}</p>
        <p>{summary}</p>
        <div className="specimen-tags">
          {tags.map((t) => (
            <span key={t.label}>{t.label}</span>
          ))}
        </div>
      </div>

      <div className="specimen-metadata">
        <div className="specimen-sigil">{sigil}</div>
        <dl>
          <dt>Venue</dt><dd>{venue}</dd>
          <dt>Dominio</dt><dd>{specimen.domain}</dd>
          <dt>Stack</dt><dd>{stack}</dd>
          <dt>Resultado</dt><dd className="metric">{metric}</dd>
        </dl>
      </div>
    </>
  );

  return (
    <article className="specimen">
      {inner}
      {url && (
        <a className="specimen-link" href={url} target="_blank" rel="noopener noreferrer">
          Ver sistema →
        </a>
      )}
    </article>
  );
}
