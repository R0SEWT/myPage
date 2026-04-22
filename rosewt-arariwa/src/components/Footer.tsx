import { SITE_CONFIG } from '../data/constants';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="grid-wrap">
        <div className="colophon">
          <p className="colophon-law">
            "Toda creación requiere sacrificio equivalente."
          </p>
          <p className="colophon-quechua">
            Munay · Llankay · Yachay
          </p>
          <div className="colophon-meta">
            <span className="meta-label">{year}</span>
            <span className="meta-value">{SITE_CONFIG.domain}</span>
            <span className="meta-value">·</span>
            <span className="meta-label">Rody Vilchez</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
