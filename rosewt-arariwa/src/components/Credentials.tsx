import { EDUCATION, CERTIFICATIONS, ACTIVITIES } from '../data/constants';

export function Credentials() {
  return (
    <section className="credentials" id="credentials">
      <div className="credentials-header">
        <span className="credentials-label">· Credenciales y marcas de origen ·</span>
        <h2 className="credentials-title">Formación <em>y certificaciones</em></h2>
      </div>

      <div className="credentials-grid">
        <div className="credentials-col">
          <div className="credentials-col-label">Formación</div>
          {EDUCATION.map((e) => (
            <div key={e.institution} className="credentials-education">
              <div className="credentials-degree">{e.degree}</div>
              <div className="credentials-institution">{e.institution}</div>
              <div className="credentials-meta">{e.expected}</div>
            </div>
          ))}

          <div className="credentials-col-label" style={{ marginTop: '32px' }}>Marcas</div>
          <ul className="credentials-activities">
            {ACTIVITIES.map((a) => (
              <li key={a.label}>
                <span className="credentials-activity-label">{a.label}</span>
                <span className="credentials-activity-detail">{a.detail} · {a.year}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="credentials-col">
          <div className="credentials-col-label">Certificaciones</div>
          <ul className="credentials-certs">
            {CERTIFICATIONS.map((c) => (
              <li key={c.label}>
                <span className="credentials-cert-label">{c.label}</span>
                <span className="credentials-cert-issuer">{c.issuer} · {c.year}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
