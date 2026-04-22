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
  return (
    <header className="archive-bar">
      <div className="archive-bar-left">
        <span className="archive-code">CIP · ARV — R.V. / 2026</span>
        <span>Banco de Germoplasma Digital · {String(specimenCount).padStart(2, '0')} especímenes</span>
      </div>
      <nav className="archive-bar-nav">
        {NAV.map(({ href, label }) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
