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
        <div className="ficha-label">Operator Profile</div>

        <div className="ficha-header">
          <div className="ficha-name">Rody Vilchez <span className="ficha-code">(R.V·26)</span></div>
          <div className="ficha-role">Applied ML Engineer</div>
        </div>

        <div className="ficha-section-label">Scope</div>
        <ul className="ficha-list">
          <li>Retrieval systems (RAG)</li>
          <li>Document Intelligence (noisy corpora)</li>
          <li>Data pipelines (multilingual)</li>
        </ul>

        <div className="ficha-section-label">Current System</div>
        <div className="ficha-row"><span>CIP · CGIAR</span></div>
        <div className="ficha-detail">→ GraphRAG over OCR-noisy corpora</div>

        <div className="ficha-section-label">Capabilities</div>
        <ul className="ficha-list">
          <li>Robust parsing (multi-layout PDFs)</li>
          <li>Embedding pipelines (batched + validated)</li>
          <li>Agent workflows (Copilot + HITL)</li>
        </ul>

        <div className="ficha-section-label">Constraints handled</div>
        <ul className="ficha-list">
          <li>Multilingual (ES/EN/FR/PT/ZH)</li>
          <li>OCR noise + layout drift</li>
          <li>Partial labels / missing structure</li>
        </ul>

        <div className="ficha-section-label">Signals</div>
        <div className="ficha-row"><span>SALA 2026</span><span>poster</span></div>
        <div className="ficha-row"><span>CCIS · Springer</span><span>accepted</span></div>

        <div className="ficha-status">
          <span className="dot-live" aria-hidden="true" />
          Active · Open to Applied ML roles
        </div>
      </aside>
    </section>
  );
}
