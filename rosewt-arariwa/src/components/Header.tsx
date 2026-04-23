import { useState } from 'react';

const NAV = [
  { href: '#thesis', label: 'Tesis' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#lineage', label: 'Linaje' },
  { href: '#research', label: 'Research' },
  { href: '#colofon', label: 'Contacto' },
];

interface HeaderProps {
  specimenCount: number;
}

export function Header({ specimenCount }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`archive-bar${open ? ' open' : ''}`}>
      <div className="archive-bar-left">
        <span className="archive-code">CIP · R.V. / 2026</span>
        <span className="archive-bar-caption">
          Catálogo de sistemas aplicados · {String(specimenCount).padStart(2, '0')}
        </span>
      </div>

      <button
        className="archive-bar-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? (
            <>
              <line x1="2" y1="2" x2="18" y2="12" />
              <line x1="2" y1="12" x2="18" y2="2" />
            </>
          ) : (
            <>
              <line x1="0" y1="1" x2="20" y2="1" />
              <line x1="0" y1="7" x2="20" y2="7" />
              <line x1="0" y1="13" x2="20" y2="13" />
            </>
          )}
        </svg>
      </button>

      <nav className="archive-bar-nav">
        {NAV.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
