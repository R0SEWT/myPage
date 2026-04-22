import type { Variant } from '../App';

interface HeaderProps {
  variant: Variant;
  onVariantToggle: () => void;
  specimenCount: number;
}

const NAV = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#lineage', label: 'Experiencia' },
  { href: '#investigacion', label: 'Investigación' },
  { href: '#contacto', label: 'Contacto' },
];

export function Header({ variant, onVariantToggle, specimenCount }: HeaderProps) {
  return (
    <header className="hdr">
      <a href="#inicio" style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/assets/wordmark.svg" alt="Arariwa" className="hdr-wordmark" />
      </a>
      <span className="hdr-counter">
        N.º ENTRADAS · {String(specimenCount).padStart(3, '0')}
      </span>
      <div className="hdr-spacer" />
      <nav>
        <ul className="hdr-nav">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="hdr-variant-toggle"
        onClick={onVariantToggle}
        title="Cambiar variante de color"
      >
        {variant === 'andino' ? 'FMA' : 'Andino'}
      </button>
    </header>
  );
}
