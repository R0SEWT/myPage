import { SITE_CONFIG } from '../data/constants';

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <svg className="hero-sigil" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent-2)' }}>
          <circle cx="200" cy="200" r="195" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="140" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="100" />
          <circle cx="200" cy="200" r="60" strokeWidth="0.5" />
          <path d="M 200 140 L 220 140 L 220 160 L 240 160 L 240 180 L 260 180 L 260 220 L 240 220 L 240 240 L 220 240 L 220 260 L 180 260 L 180 240 L 160 240 L 160 220 L 140 220 L 140 180 L 160 180 L 160 160 L 180 160 L 180 140 Z" strokeWidth="1.2" />
          <circle cx="200" cy="200" r="12" />
          <circle cx="200" cy="200" r="4" fill="currentColor" />
          <path d="M 200 40 L 360 200 L 200 360 L 40 200 Z" strokeWidth="0.5" />
          <path d="M 200 80 L 212 100 L 188 100 Z" />
          <path d="M 320 200 L 300 212 L 300 188 Z" />
          <path d="M 200 320 L 188 300 L 212 300 Z" />
          <path d="M 80 200 L 100 188 L 100 212 Z" />
          <g strokeWidth="0.7">
            <circle cx="200" cy="50" r="4" />
            <circle cx="306" cy="94" r="4" />
            <circle cx="350" cy="200" r="4" />
            <circle cx="306" cy="306" r="4" />
            <circle cx="200" cy="350" r="4" />
            <circle cx="94" cy="306" r="4" />
            <circle cx="50" cy="200" r="4" />
            <circle cx="94" cy="94" r="4" />
          </g>
          <line x1="50" y1="200" x2="350" y2="200" strokeWidth="0.3" />
          <line x1="200" y1="50" x2="200" y2="350" strokeWidth="0.3" />
        </g>
      </svg>

      <div>
        <div className="hero-folio">
          <span>Folio 00 · Portada</span>
          <span className="hero-folio-sep" />
          <span>Lima · 12°S 77°O</span>
        </div>

        <h1>
          Rody<br />
          Vilchez, <em>curador</em><br />
          de sistemas<br />
          aplicados.
        </h1>

        <p className="hero-subtitle">{SITE_CONFIG.summary}</p>

        <dl className="hero-meta">
          <dt>Rol</dt>
          <dd>Applied ML Engineer — Retrieval · Document Intelligence</dd>
          <dt>Filiación</dt>
          <dd>CIP (CGIAR) · UPC</dd>
          <dt>Correspondencia</dt>
          <dd>
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
          </dd>
          <dt>Enlaces</dt>
          <dd>
            <a href={SITE_CONFIG.github} target="_blank" rel="noopener">GitHub</a>
            {' · '}
            <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          </dd>
        </dl>
      </div>

      <aside className="ficha-portador">
        <div className="ficha-label">Ficha del portador</div>
        <div className="ficha-row"><span>Código</span><span>ARV·R.V·26</span></div>
        <div className="ficha-row"><span>Procedencia</span><span>Lima, Perú</span></div>
        <div className="ficha-row"><span>Linaje</span><span>UPC · CIP</span></div>
        <div className="ficha-row"><span>Dominios</span><span>Retrieval · DocAI</span></div>
        <div className="ficha-row"><span>Estado</span><span style={{ color: 'var(--success)' }}>Activo</span></div>
        <div className="ficha-row"><span>Publicaciones</span><span>2 · conferencia</span></div>
        <div className="ficha-row"><span>Sistemas</span><span>4 · catalogados</span></div>
        <div className="ficha-quote">
          "Los Papa Arariwa fueron los primeros agricultores científicos del continente. Trabajo desde esa línea."
        </div>
      </aside>
    </section>
  );
}
