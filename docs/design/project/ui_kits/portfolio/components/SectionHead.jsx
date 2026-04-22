// SectionHead.jsx — roman numeral, seal, title, count
function SectionHead({ roman, seal, title, count }) {
  return (
    <div className="section-head">
      <img src={seal} className="seal" alt="" />
      <div>
        <div className="roman">{roman}</div>
        <h2>{title}</h2>
      </div>
      <div className="count">{count} especímenes</div>
    </div>
  );
}
Object.assign(window, { SectionHead });
