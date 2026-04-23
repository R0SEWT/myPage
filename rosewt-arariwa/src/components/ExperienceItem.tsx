import type { ExperienceEntry } from '../data/constants';

interface ExperienceItemProps {
  entry: ExperienceEntry;
}

export function ExperienceItem({ entry }: ExperienceItemProps) {
  const { company, role, period, bullets } = entry;
  return (
    <div className="lineage-entry">
      <div className="lineage-period">
        {period}
      </div>
      <div className="lineage-content">
        <h4>{role}</h4>
        <h5>{company}</h5>
        {bullets.map((b) => (
          <p key={b}>{b}</p>
        ))}
      </div>
    </div>
  );
}
