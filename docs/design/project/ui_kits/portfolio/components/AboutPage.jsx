// AboutPage.jsx — the conceptual anchor
function AboutPage() {
  return (
    <div>
      <section style={{padding:'96px 0 80px',display:'grid',gridTemplateColumns:'1fr 240px',gap:64,borderBottom:'1px solid var(--hairline)',alignItems:'start'}}>
        <div>
          <Quechua>Arariwa · Guardián</Quechua>
          <p className="anchor-quote" style={{marginTop:24}}>
            Los Papa Arariwa fueron los <em style={{color:'var(--cochineal)'}}>primeros científicos</em> de los Andes.
          </p>
        </div>
        <img src="../../assets/arariwa-figure.svg" alt="" style={{width:220,height:'auto',marginLeft:'auto'}}/>
      </section>

      <section className="section-body">
        <div className="sidelabel">I · Origen</div>
        <div>
          <h3>Agricultores científicos</h3>
          <p>
            Durante milenios, los guardianes de la semilla — los <em>Papa Arariwa</em> —
            transmutaron biodiversidad en seguridad alimentaria mediante conocimiento
            codificado en textil. No decoraban sus mantos: los programaban. Cada celda,
            un símbolo; cada símbolo, una instrucción sobre cómo leer la tierra, el
            ciclo, el riesgo.
          </p>
          <p>
            El Centro Internacional de la Papa adoptó esta figura como su logotipo en 1971,
            para no olvidar que la ciencia agrícola en los Andes es una tradición de
            nueve mil años, no un campo nuevo.
          </p>
        </div>
      </section>

      <section className="section-body">
        <div className="sidelabel">II · Método</div>
        <div>
          <h3>El círculo de transmutación</h3>
          <p>
            Un pipeline de machine learning es esencialmente un círculo de transmutación:
            inputs, restricciones, proceso, output. La ley del intercambio equivalente se
            sostiene aquí con la misma dureza — cada ganancia en una dimensión (recall,
            latencia, cobertura) se paga en otra (costo, sesgo, fragilidad).
          </p>
          <blockquote>
            No hay transmutación sin intercambio equivalente.
            <br/><span style={{fontFamily:'var(--small-caps)',fontVariant:'small-caps',fontStyle:'italic',fontSize:16,color:'var(--ochre-700)',letterSpacing:'0.08em'}}>Chaypi chaypi · kay kaymanta</span>
          </blockquote>
          <p>
            Este sitio cataloga cada sistema que construyo como un espécimen: con su
            procedencia, sus restricciones, su proceso, y su resultado honesto —
            incluido lo que se perdió para obtenerlo.
          </p>
        </div>
      </section>

      <section className="section-body">
        <div className="sidelabel">III · Linaje</div>
        <div>
          <h3>Un banco de germoplasma digital</h3>
          <p>
            El CIP mantiene un banco de germoplasma con más de 4 500 variedades
            de papa. Cada entrada tiene su código, su procedencia, sus
            características y su linaje. Este portafolio funciona con la misma lógica:
            cada proyecto es una entrada, cada entrada remite a las que la
            antecedieron. El linaje es explícito.
          </p>
        </div>
      </section>
    </div>
  );
}
Object.assign(window, { AboutPage });
