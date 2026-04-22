interface SectionHeadProps {
  title: string;
  emphasize?: string;
  seal: string;
  sealAlt: string;
  count?: number;
}

export function SectionHead({ title, emphasize, seal, sealAlt, count }: SectionHeadProps) {
  const renderTitle = () => {
    if (!emphasize) return title;
    const parts = title.split(emphasize);
    return (
      <>
        {parts[0]}
        <em>{emphasize}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="section-head">
      <img src={seal} alt={sealAlt} className="section-head-seal" />
      <h2 className="section-head-title">{renderTitle()}</h2>
      {count != null && (
        <span className="section-head-count">
          {String(count).padStart(2, '0')} entradas
        </span>
      )}
    </div>
  );
}
