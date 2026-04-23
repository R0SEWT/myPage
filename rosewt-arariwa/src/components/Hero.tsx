import { SITE_CONFIG, STACK_RAIL } from '../data/constants';
import { AlchemySigil } from './atoms/AlchemySigil';

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-sigil" aria-hidden="true">
        <AlchemySigil variant="chakana" size={520} strokeWidth={1} />
      </div>

      <div>
        <div className="hero-folio" aria-label="folio y ubicación">
          <span>Folio 00 · Portada</span>
          <span className="hero-folio-sep" />
          <span>Lima · 12°S 77°O</span>
        </div>

        <div className="hero-anchor">
          <AlchemySigil variant="flamel" size={22} strokeWidth={1.2} className="hero-anchor-sigil" />
          <span>Applied ML Engineer</span>
        </div>

        <h1>
          Rody<br />
          Vilchez, <em>curador</em><br />
          de sistemas<br />
          aplicados.
        </h1>

        <p className="hero-subtitle">{SITE_CONFIG.summary}</p>

        <div className="hero-stack-rail">
          {STACK_RAIL.map((t, i) => (
            <span key={t}>
              {t}
              {i < STACK_RAIL.length - 1 && <span className="sep"> · </span>}
            </span>
          ))}
        </div>

        <dl className="hero-meta">
          <dt>Rol</dt>
          <dd>{SITE_CONFIG.subheadline}</dd>
          <dt>Filiación</dt>
          <dd>CIP (CGIAR) · UPC</dd>
          <dt>Estado</dt>
          <dd>
            <span className="dot-live" aria-hidden="true" />
            Open to Applied ML roles · remote or Lima
          </dd>
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

        <div className="hero-cta-rail">
          <a className="btn btn-primary" href={SITE_CONFIG.cvEs} target="_blank" rel="noopener">
            Descargar CV · ES
          </a>
          <a className="btn btn-primary" href={SITE_CONFIG.cvEn} target="_blank" rel="noopener">
            Descargar CV · EN
          </a>
          <a className="btn btn-accent" href={`mailto:${SITE_CONFIG.email}`}>
            Escribir
          </a>
        </div>
      </div>

      <aside className="ficha-portador">
        <AlchemySigil
          variant="ouroboros"
          size={40}
          strokeWidth={1}
          className="ficha-ouroboros"
        />
        <div className="ficha-label">Ficha del portador</div>
        <div className="ficha-row"><span>Código</span><span>ARV·R.V·26</span></div>
        <div className="ficha-row"><span>Procedencia</span><span>Lima, Perú</span></div>
        <div className="ficha-row"><span>Linaje</span><span>UPC · CIP</span></div>
        <div className="ficha-row"><span>Dominios</span><span>Retrieval · DocAI · Pipelines</span></div>
        <div className="ficha-row"><span>Estado</span><span style={{ color: 'var(--success)' }}>Activo</span></div>
        <div className="ficha-row"><span>Publicaciones</span><span>WAILAMP · SIMBIG · Springer CCIS</span></div>
        <blockquote className="ficha-quote">
          "Los humanos no pueden obtener nada sin dar algo a cambio. Para obtener, algo de igual valor debe perderse. Esa es la primera ley de la alquimia."
          <cite className="ficha-attribution">— Edward Elric</cite>
        </blockquote>
      </aside>
    </section>
  );
}
