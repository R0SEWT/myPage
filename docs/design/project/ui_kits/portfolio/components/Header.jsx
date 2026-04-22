// Header.jsx — wordmark + nav + catalog counter
function Header({ active, onNav, count }) {
  const items = [
    { id: 'index',    label: 'Catálogo' },
    { id: 'research', label: 'Investigación' },
    { id: 'about',    label: 'Arariwa' },
    { id: 'contact',  label: 'Contacto' },
  ];
  return (
    <header className="hdr">
      <a onClick={() => onNav('index')} style={{cursor:'pointer'}}>
        <img src="../../assets/wordmark.svg" alt="Arariwa" className="wm" />
      </a>
      <div className="counter">{count != null ? `N.º ENTRADAS · ${String(count).padStart(3,'0')}` : ''}</div>
      <nav>
        {items.map(i => (
          <a key={i.id}
             className={active === i.id ? 'active' : ''}
             onClick={() => onNav(i.id)}>{i.label}</a>
        ))}
      </nav>
    </header>
  );
}
Object.assign(window, { Header });
