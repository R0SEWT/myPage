// SpecimenDetail.jsx — full detail page for one specimen
function SpecimenDetail({ s, onBack }) {
  if (!s) return null;
  return (
    <div>
      <div style={{padding:'18px 0'}}>
        <a onClick={onBack} style={{cursor:'pointer',fontFamily:'var(--mono)',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--fg-3)'}}>
          ← Volver al catálogo
        </a>
      </div>

      <section className="detail-hero">
        <div>
          <div className="codebadge">Entrada {s.code} · {s.domain}</div>
          <h1>{s.title}</h1>
          <p className="sub">{s.summary}</p>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:24}}>
            {s.tags.map((t,i) => <Tag key={i} variant={t.variant}>{t.label}</Tag>)}
          </div>
        </div>
        <div className="field-card">
          <h4>Ficha técnica</h4>
          <dl>
            <dt>Código</dt><dd>{s.code}</dd>
            <dt>Cosecha</dt><dd>{s.year}</dd>
            <dt>Estado</dt><dd>{s.status}</dd>
            <dt>Dominio</dt><dd>{s.domain}</dd>
            <dt>Procedencia</dt><dd>{s.provenance}</dd>
          </dl>
        </div>
      </section>

      <section className="section-body">
        <div className="sidelabel">I · Restricciones</div>
        <div>
          <h3>Lo que no se podía transmutar</h3>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:'10px 24px',fontFamily:'var(--serif-body)',fontSize:16,marginTop:8}}>
            {s.constraints.map(([k,v],i) => (
              <React.Fragment key={i}>
                <div style={{fontFamily:'var(--mono)',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--fg-3)',paddingTop:4}}>{k}</div>
                <div>{v}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="section-body">
        <div className="sidelabel">II · Proceso</div>
        <div>
          <h3>El círculo de activación</h3>
          <p>{s.process}</p>
        </div>
      </section>

      <section className="section-body">
        <div className="sidelabel">III · Resultado</div>
        <div>
          <h3>El intercambio</h3>
          <p>{s.outcome}</p>
          <blockquote>Ningún modelo existe sin su contrapartida. Lo que ganamos en una dimensión lo pagamos en otra — explícito es mejor que silencioso.</blockquote>
        </div>
      </section>
    </div>
  );
}
Object.assign(window, { SpecimenDetail });
