import type { ResearchEntry } from '../data/constants';
import { Tag } from './atoms/Tag';

interface ResearchItemProps {
  entry: ResearchEntry;
}

export function ResearchItem({ entry }: ResearchItemProps) {
  const { title, venue, year, status, url, bullets } = entry;
  return (
    <article className="research-item">
      <div>
        <h3 className="research-title">{title}</h3>
        <p className="research-venue">{venue}</p>
        <ul className="lineage-bullets" style={{ marginBottom: 'var(--space-4)' }}>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a
          href={url}
          className="research-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositorio →
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
        <span className="meta-value">{year}</span>
        <Tag label={status} variant="active" />
      </div>
    </article>
  );
}
