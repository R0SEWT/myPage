import './styles/arariwa.css';
import './styles/layout.css';

import { SPECIMENS, EXPERIENCE, RESEARCH } from './data/constants';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SpecimenCard } from './components/SpecimenCard';
import { Skills } from './components/Skills';
import { ExperienceItem } from './components/ExperienceItem';
import { Credentials } from './components/Credentials';
import { ResearchItem } from './components/ResearchItem';
import { Footer } from './components/Footer';
import { AlchemySigil } from './components/atoms/AlchemySigil';

export default function App() {
  return (
    <>
      <Header specimenCount={SPECIMENS.length} />

      <div className="container">

        <Hero />

        {/* Divisor */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <AlchemySigil variant="chakana-mini" size={64} className="section-sigil" />
          <div className="section-divider-line" />
        </div>

        {/* Tesis */}
        <section className="thesis" id="thesis">
          <div className="thesis-label">· Tesis del archivo ·</div>
          <p>
            Trabajo sobre sistemas donde las decisiones importan: cómo se procesan los datos,{' '}
            <span className="thesis-emphasis">qué se optimiza</span> y{' '}
            <span className="thesis-emphasis">qué se sacrifica</span>.
          </p>
          <p>
            Este portafolio no muestra solo resultados, sino las elecciones que los hacen posibles.
          </p>
        </section>

        {/* Catálogo */}
        <section className="catalog" id="catalogo">
          <div className="catalog-header">
            <h2 className="catalog-title">Catálogo de <em>sistemas</em></h2>
            <span className="catalog-meta">{String(SPECIMENS.length).padStart(2, '0')} sistemas · retrieval · docAI · cv · pipelines</span>
          </div>
          <div className="specimen-grid">
            {SPECIMENS.map((s) => (
              <SpecimenCard key={s.code} specimen={s} />
            ))}
          </div>
        </section>

        {/* Skills */}
        <Skills />

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

        {/* Credentials */}
        <Credentials />

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
