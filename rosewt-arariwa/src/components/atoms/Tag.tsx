import type { TagVariant } from '../../data/constants';

interface TagProps {
  label: string;
  variant?: TagVariant;
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const cls = `tag${variant !== 'default' ? ` tag--${variant}` : ''}`;
  return <span className={cls}>{label}</span>;
}
