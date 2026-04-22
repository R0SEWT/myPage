import { SITE_CONFIG } from '../data/constants';
import { Meta } from './atoms/Meta';

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="grid-wrap">
        <div className="hero-inner">
          <div>
            <p className="hero-folio">ARV / 2026 · Banco de Germoplasma Digital</p>
            <h1 className="hero-h1">
              Applied ML<br />
              <em>Engineer</em>
            </h1>
            <p className="hero-subtitle">
              {SITE_CONFIG.summary}
            </p>
            <div className="hero-meta">
              <Meta label="Base" value={SITE_CONFIG.location} />
              <Meta label="Inst." value="CIP · CGIAR" />
            </div>
            <div className="hero-cta">
              <a
                href={SITE_CONFIG.cvEs}
                className="btn btn-primary"
                download
                target="_blank"
                rel="noopener"
              >
                CV · ES
              </a>
              <a
                href={SITE_CONFIG.cvEn}
                className="btn btn-primary"
                download
                target="_blank"
                rel="noopener"
              >
                CV · EN
              </a>
              <a href="#contacto" className="btn btn-accent">
                Contacto
              </a>
            </div>
          </div>
          <img
            src="/assets/seal-systems.svg"
            alt="Arariwa — Systems"
            className="hero-seal arariwa-sigil-rotate"
          />
        </div>
      </div>
    </section>
  );
}
