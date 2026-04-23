type Variant = 'chakana' | 'chakana-mini' | 'flamel' | 'ouroboros';

interface AlchemySigilProps {
  variant: Variant;
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

export function AlchemySigil({
  variant,
  size = 24,
  strokeWidth = 1,
  className,
  title,
}: AlchemySigilProps) {
  const ariaProps = title
    ? { role: 'img' as const, 'aria-label': title }
    : { role: 'presentation' as const, 'aria-hidden': true as const };

  /* Chakana completa — 5 bandas, rosa de 8 puntos, ejes cardinales,
     cruz escalonada, 4 flechas direccionales. ViewBox grande para densidad. */
  if (variant === 'chakana') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        {...ariaProps}
      >
        <circle cx="200" cy="200" r="195" strokeWidth={strokeWidth * 0.5} />
        <circle cx="200" cy="200" r="180" />
        <circle cx="200" cy="200" r="140" strokeWidth={strokeWidth * 0.5} />
        <circle cx="200" cy="200" r="100" />
        <circle cx="200" cy="200" r="60" strokeWidth={strokeWidth * 0.5} />
        <path
          d="M 200 140 L 220 140 L 220 160 L 240 160 L 240 180 L 260 180 L 260 220 L 240 220 L 240 240 L 220 240 L 220 260 L 180 260 L 180 240 L 160 240 L 160 220 L 140 220 L 140 180 L 160 180 L 160 160 L 180 160 L 180 140 Z"
          strokeWidth={strokeWidth * 1.2}
        />
        <circle cx="200" cy="200" r="12" />
        <circle cx="200" cy="200" r="4" fill="currentColor" />
        <path d="M 200 40 L 360 200 L 200 360 L 40 200 Z" strokeWidth={strokeWidth * 0.5} />
        <path d="M 200 80 L 212 100 L 188 100 Z" />
        <path d="M 320 200 L 300 212 L 300 188 Z" />
        <path d="M 200 320 L 188 300 L 212 300 Z" />
        <path d="M 80 200 L 100 188 L 100 212 Z" />
        <g strokeWidth={strokeWidth * 0.7}>
          <circle cx="200" cy="50" r="4" />
          <circle cx="306" cy="94" r="4" />
          <circle cx="350" cy="200" r="4" />
          <circle cx="306" cy="306" r="4" />
          <circle cx="200" cy="350" r="4" />
          <circle cx="94" cy="306" r="4" />
          <circle cx="50" cy="200" r="4" />
          <circle cx="94" cy="94" r="4" />
        </g>
        <line x1="50" y1="200" x2="350" y2="200" strokeWidth={strokeWidth * 0.3} />
        <line x1="200" y1="50" x2="200" y2="350" strokeWidth={strokeWidth * 0.3} />
      </svg>
    );
  }

  /* Chakana-mini — versión compacta para dividers/stamps (viewBox 64) */
  if (variant === 'chakana-mini') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        {...ariaProps}
      >
        <circle cx="32" cy="32" r="30" />
        <path d="M 32 16 L 40 16 L 40 24 L 48 24 L 48 40 L 40 40 L 40 48 L 24 48 L 24 40 L 16 40 L 16 24 L 24 24 L 24 16 Z" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'flamel') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        {...ariaProps}
      >
        <circle cx="32" cy="32" r="26" />
        <path d="M 18 44 L 46 44 L 32 18 Z" strokeWidth={strokeWidth * 1.1} />
        <path d="M 14 36 L 50 36" />
        <line x1="32" y1="10" x2="32" y2="54" strokeWidth={strokeWidth * 0.6} />
        <circle cx="32" cy="36" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      {...ariaProps}
    >
      <circle cx="32" cy="32" r="24" strokeWidth={strokeWidth * 1.1} />
      <path
        d="M 32 8 A 24 24 0 1 1 14 48 A 16 16 0 0 0 50 40 A 24 24 0 0 1 32 8 Z"
        strokeWidth={strokeWidth * 0.7}
        opacity="0.65"
      />
      <circle cx="32" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}
