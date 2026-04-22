// Hero.jsx — display heading + anchor + seal
function Hero() {
  return (
    <section className="hero">
      <div>
        <Quechua>Yachay · Ruway · Munay</Quechua>
        <h1 style={{marginTop:16}}>
          Un catálogo de <em>transmutaciones</em>
          <br/>bajo restricciones reales.
        </h1>
        <p className="lede">
          Cada sistema aquí es un espécimen — catalogado con su procedencia,
          sus restricciones, su proceso, y su resultado. Ley del intercambio
          equivalente: ningún modelo existe sin su contrapartida.
        </p>
        <div style={{display:'flex',gap:12,marginTop:32}}>
          <Button variant="primary">Explorar el banco</Button>
          <Button>Leer el manifiesto</Button>
        </div>
      </div>
      <aside>
        <img src="../../assets/seal-systems.svg" alt="Sello" />
        <div className="anchor-meta">Sello III · Sistemas Aplicados</div>
      </aside>
    </section>
  );
}
Object.assign(window, { Hero });
