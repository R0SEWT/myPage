import './styles/arariwa.css';
import './styles/layout.css';

import { SPECIMENS, EXPERIENCE, RESEARCH } from './data/constants';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SpecimenCard } from './components/SpecimenCard';
import { ExperienceItem } from './components/ExperienceItem';
import { ResearchItem } from './components/ResearchItem';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Header specimenCount={SPECIMENS.length} />

      <div className="container">

        <Hero />

        {/* Divisor */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <svg className="section-sigil" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--accent)' }}>
            <circle cx="32" cy="32" r="30" />
            <path d="M 32 16 L 40 16 L 40 24 L 48 24 L 48 40 L 40 40 L 40 48 L 24 48 L 24 40 L 16 40 L 16 24 L 24 24 L 24 16 Z" />
            <circle cx="32" cy="32" r="3" fill="currentColor" />
          </svg>
          <div className="section-divider-line" />
        </div>

        {/* Tesis */}
        <section className="thesis" id="thesis">
          <div className="thesis-label">· Tesis del archivo ·</div>
          <p>
            Los Papa Arariwa preservaron durante seis mil años la biodiversidad de la papa mediante un sistema de conocimiento codificado en{' '}
            <span className="thesis-emphasis">textiles, rituales y prácticas agrícolas</span>. Eran ingenieros antes del término.
          </p>
          <p>
            Este portafolio es un banco de germoplasma digital: cada sistema que construyo es un espécimen catalogado —
            con su procedencia, sus restricciones, su linaje y su resultado. La ley de equivalencia es real: no hay modelo sin intercambio.
          </p>
        </section>

        {/* Catálogo */}
        <section className="catalog" id="catalogo">
          <div className="catalog-header">
            <h2 className="catalog-title">Catálogo de <em>especímenes</em></h2>
            <span className="catalog-meta">{String(SPECIMENS.length).padStart(2, '0')} sistemas · filtrables por dominio</span>
          </div>
          <div className="specimen-grid">
            {SPECIMENS.map((s) => (
              <SpecimenCard key={s.code} specimen={s} />
            ))}
          </div>
        </section>

        {/* Linaje */}
        <section className="lineage" id="lineage">
          <div className="lineage-grid">
            <div>
              <div className="lineage-intro">· Procedencia del espécimen</div>
              <h2 className="lineage-title">Linaje<br />y <em>filiación</em></h2>
            </div>
            <div>
              {EXPERIENCE.map((e, i) => (
                <ExperienceItem key={e.company} entry={e} isCurrent={i === 0} />
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Research — full bleed */}
      {RESEARCH.map((r) => (
        <section key={r.title} className="research" id="research">
          <ResearchItem entry={r} />
        </section>
      ))}

      <div className="container">
        <Footer />
      </div>
    </>
  );
}
