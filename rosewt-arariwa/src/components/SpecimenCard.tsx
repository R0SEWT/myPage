import type { Specimen } from '../data/constants';
import { Tag } from './atoms/Tag';

interface SpecimenCardProps {
  specimen: Specimen;
}

export function SpecimenCard({ specimen }: SpecimenCardProps) {
  const { code, domain, title, tags, status, seal, url } = specimen;

  const inner = (
    <>
      <span className="specimen-code">{code}</span>
      <span className="specimen-domain">{domain}</span>
      <span className="specimen-title">{title}</span>
      <span className="specimen-tags">
        {tags.map((t) => (
          <Tag key={t.label} label={t.label} variant={t.variant} />
        ))}
      </span>
      <span className="specimen-tags">
        <Tag
          label={status}
          variant={status === 'Activo' ? 'ok' : 'default'}
        />
      </span>
      <img src={seal} alt="" className="specimen-seal" aria-hidden="true" />
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        className="specimen-card"
        target="_blank"
        rel="noopener noreferrer"
        style={{ cursor: 'pointer' }}
      >
        {inner}
      </a>
    );
  }

  return <div className="specimen-card">{inner}</div>;
}
