import { useState, useEffect } from 'react';
import './styles/arariwa.css';
import './styles/layout.css';

import { SPECIMENS, EXPERIENCE, RESEARCH } from './data/constants';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectionHead } from './components/SectionHead';
import { SpecimenCard } from './components/SpecimenCard';
import { ExperienceItem } from './components/ExperienceItem';
import { ResearchItem } from './components/ResearchItem';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export type Variant = 'andino' | 'fma';

export default function App() {
  const [variant, setVariant] = useState<Variant>('andino');

  useEffect(() => {
    document.body.setAttribute('data-variant', variant);
  }, [variant]);

  const toggleVariant = () =>
    setVariant((v) => (v === 'andino' ? 'fma' : 'andino'));

  return (
    <>
      <Header
        variant={variant}
        onVariantToggle={toggleVariant}
        specimenCount={SPECIMENS.length}
      />

      <main>
        <Hero />

        <section id="catalogo">
          <div className="grid-wrap">
            <SectionHead
              title="Catálogo"
              seal="/assets/seal-retrieval.svg"
              sealAlt="Retrieval"
              count={SPECIMENS.length}
            />
            <div>
              {SPECIMENS.map((s) => (
                <SpecimenCard key={s.code} specimen={s} />
              ))}
            </div>
          </div>
        </section>

        <section id="lineage">
          <div className="grid-wrap">
            <SectionHead
              title="Experiencia"
              seal="/assets/seal-systems.svg"
              sealAlt="Systems"
              count={EXPERIENCE.length}
            />
            <div className="lineage-list">
              {EXPERIENCE.map((e) => (
                <ExperienceItem key={e.company} entry={e} />
              ))}
            </div>
          </div>
        </section>

        <section id="investigacion">
          <div className="grid-wrap">
            <SectionHead
              title="Investigación"
              seal="/assets/seal-research.svg"
              sealAlt="Research"
              count={RESEARCH.length}
            />
            <div>
              {RESEARCH.map((r) => (
                <ResearchItem key={r.title} entry={r} />
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
