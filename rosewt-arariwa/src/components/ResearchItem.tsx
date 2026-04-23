import type { ResearchEntry } from '../data/constants';

interface ResearchItemProps {
  entry: ResearchEntry;
}

export function ResearchItem({ entry }: ResearchItemProps) {
  const { title, titleEm, venue, bullets, metrics, url } = entry;
  return (
    <div className="research-inner">
      <div>
        <div className="research-label">
          Fragmento de Research
          <span className="research-label-sub">· Papers · Talks</span>
        </div>
      </div>
      <div className="research-body">
        <h2>
          {title}
          {titleEm && <em>{titleEm}</em>}
        </h2>
        <p className="venue">{venue}</p>
        {bullets.map((b) => (
          <p key={b}>{b}</p>
        ))}
        {metrics.length > 0 && (
          <div className="research-metrics">
            {metrics.map((m) => (
              <div key={m.label} className="research-metric">
                <span className="val">{m.val}</span>
                {m.label}
              </div>
            ))}
          </div>
        )}
        <p style={{ marginTop: '24px' }}>
          <a href={url} className="research-link" target="_blank" rel="noopener noreferrer">
            Repositorio →
          </a>
        </p>
      </div>
    </div>
  );
}
