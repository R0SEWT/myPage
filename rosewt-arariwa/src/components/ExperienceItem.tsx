import type { ExperienceEntry } from '../data/constants';

interface ExperienceItemProps {
  entry: ExperienceEntry;
}

export function ExperienceItem({ entry }: ExperienceItemProps) {
  const { company, role, period, bullets } = entry;
  return (
    <article className="lineage-item">
      <div>
        <h3 className="lineage-role">{role}</h3>
        <p className="lineage-company">{company}</p>
        <ul className="lineage-bullets">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <p className="lineage-period">{period}</p>
    </article>
  );
}
