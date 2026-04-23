import { SKILLS } from '../data/constants';

export function Skills() {
  return (
    <section className="skills" id="skills" data-reveal>
      <div className="skills-header">
        <span className="skills-label">· Archivo de habilidades ·</span>
        <h2 className="skills-title">Stack <em>operativo</em></h2>
      </div>
      <div className="skills-grid">
        {SKILLS.map((group) => (
          <div key={group.label} className="skills-group">
            <div className="skills-group-label">{group.label}</div>
            <ul className="skills-items">
              {group.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
