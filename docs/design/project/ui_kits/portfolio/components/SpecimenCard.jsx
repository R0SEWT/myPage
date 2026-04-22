// SpecimenCard.jsx — one catalog entry row
function SpecimenCard({ s, onOpen }) {
  return (
    <div className="specimen" onClick={() => onOpen && onOpen(s)}>
      <div className="code">{s.code}</div>
      <img className="icon" src={s.seal} alt="" />
      <div>
        <div className="title">
          {s.title}
          <small>{s.summary}</small>
        </div>
        <div className="tags">
          {s.tags.map((t,i) => <Tag key={i} variant={t.variant}>{t.label}</Tag>)}
        </div>
      </div>
      <div className="meta">
        <span>{s.year} · cosecha</span>
        <span>{s.domain}</span>
        <span>{s.status}</span>
      </div>
      <div className="arrow">→</div>
    </div>
  );
}

function SpecimenGrid({ items, onOpen }) {
  return (
    <div className="specimens">
      {items.map(s => <SpecimenCard key={s.code} s={s} onOpen={onOpen} />)}
    </div>
  );
}

Object.assign(window, { SpecimenCard, SpecimenGrid });
