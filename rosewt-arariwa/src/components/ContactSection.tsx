import { SITE_CONFIG } from '../data/constants';

export function ContactSection() {
  return (
    <section id="contacto">
      <div className="grid-wrap">
        <div className="contact-inner">
          <div>
            <h2 className="contact-heading">
              Diseño para condiciones<br />
              <em>no ideales</em>
            </h2>
            <p className="contact-note">
              Respuesta en menos de 48h · Disponible para roles Data/ML · Abierto a colaboraciones
            </p>
          </div>
          <div className="contact-links">
            <div className="contact-link-row">
              <span className="contact-link-label">Email</span>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="contact-link-value"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            <div className="contact-link-row">
              <span className="contact-link-label">GitHub</span>
              <a
                href={SITE_CONFIG.github}
                className="contact-link-value"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/R0SEWT
              </a>
            </div>
            <div className="contact-link-row">
              <span className="contact-link-label">LinkedIn</span>
              <a
                href={SITE_CONFIG.linkedin}
                className="contact-link-value"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/r0sewt
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
