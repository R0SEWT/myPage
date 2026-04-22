interface MetaProps {
  label: string;
  value: string;
}

export function Meta({ label, value }: MetaProps) {
  return (
    <span style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline' }}>
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </span>
  );
}
