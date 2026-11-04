import { type Service } from '../data/content'

export function ServicePreviewArtwork({ glyph, active }: { glyph: Service['glyph']; active: boolean }) {
  if (glyph === 'orbit') {
    return (
      <svg
        viewBox="0 0 280 280"
        className={`service-preview-svg ${active ? 'is-active' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <circle cx="140" cy="140" r="105" stroke="rgba(243,241,233,0.12)" strokeDasharray="3 4" />
        <ellipse
          cx="140"
          cy="140"
          rx="124"
          ry="48"
          stroke="rgba(214,243,106,0.65)"
          strokeWidth="1.2"
          transform="rotate(-28 140 140)"
        />
        <ellipse
          cx="140"
          cy="140"
          rx="116"
          ry="64"
          stroke="rgba(243,241,233,0.28)"
          strokeWidth="1"
          transform="rotate(42 140 140)"
        />
        <circle cx="140" cy="140" r="16" fill="rgba(214,243,106,0.18)" />
        <circle cx="140" cy="140" r="5" fill="#D6F36A" />
        <circle cx="218" cy="88" r="3.5" fill="#F3F1E9" />
      </svg>
    )
  }

  if (glyph === 'signal') {
    return (
      <svg
        viewBox="0 0 280 280"
        className={`service-preview-svg ${active ? 'is-active' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <circle cx="140" cy="140" r="38" stroke="rgba(214,243,106,0.7)" strokeWidth="1.2" />
        <circle cx="140" cy="140" r="74" stroke="rgba(243,241,233,0.22)" strokeDasharray="4 6" />
        <circle cx="140" cy="140" r="112" stroke="rgba(214,243,106,0.3)" strokeWidth="1" />
        <line x1="140" y1="20" x2="140" y2="260" stroke="rgba(243,241,233,0.14)" />
        <line x1="20" y1="140" x2="260" y2="140" stroke="rgba(243,241,233,0.14)" />
        <polygon points="140,40 145,140 140,145 135,140" fill="#D6F36A" opacity="0.8" />
        <circle cx="140" cy="140" r="4" fill="#F3F1E9" />
      </svg>
    )
  }

  if (glyph === 'wave') {
    return (
      <svg
        viewBox="0 0 280 280"
        className={`service-preview-svg ${active ? 'is-active' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 140 Q 80 70, 140 140 T 260 140"
          stroke="rgba(214,243,106,0.75)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 140 Q 80 95, 140 140 T 260 140"
          stroke="rgba(243,241,233,0.3)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M20 140 Q 80 185, 140 140 T 260 140"
          stroke="rgba(214,243,106,0.25)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle cx="140" cy="140" r="6" fill="#D6F36A" />
      </svg>
    )
  }

  if (glyph === 'search') {
    return (
      <svg
        viewBox="0 0 280 280"
        className={`service-preview-svg ${active ? 'is-active' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <circle cx="125" cy="125" r="72" stroke="rgba(214,243,106,0.8)" strokeWidth="1.5" />
        <circle cx="125" cy="125" r="54" stroke="rgba(243,241,233,0.24)" strokeDasharray="3 5" />
        <circle cx="125" cy="125" r="32" stroke="rgba(243,241,233,0.4)" />
        <line x1="178" y1="178" x2="242" y2="242" stroke="rgba(214,243,106,0.85)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="125" cy="125" r="4" fill="#D6F36A" />
      </svg>
    )
  }

  if (glyph === 'mark') {
    return (
      <svg
        viewBox="0 0 280 280"
        className={`service-preview-svg ${active ? 'is-active' : ''}`}
        fill="none"
        aria-hidden="true"
      >
        <rect x="55" y="55" width="170" height="170" stroke="rgba(243,241,233,0.18)" strokeWidth="1" />
        <circle cx="140" cy="140" r="85" stroke="rgba(214,243,106,0.6)" strokeWidth="1.2" />
        <line x1="55" y1="55" x2="225" y2="225" stroke="rgba(214,243,106,0.3)" />
        <line x1="55" y1="225" x2="225" y2="55" stroke="rgba(243,241,233,0.14)" />
        <circle cx="140" cy="140" r="5" fill="#D6F36A" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 280 280"
      className={`service-preview-svg ${active ? 'is-active' : ''}`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="rgba(243,241,233,0.15)">
        <path d="M40 70 L240 70 M40 140 L240 140 M40 210 L240 210" />
        <path d="M70 40 L70 240 M140 40 L140 240 M210 40 L210 240" />
      </g>
      <rect x="70" y="70" width="140" height="140" stroke="rgba(214,243,106,0.75)" strokeWidth="1.5" />
      <rect x="95" y="95" width="90" height="90" stroke="rgba(243,241,233,0.35)" strokeDasharray="3 4" />
      <circle cx="70" cy="70" r="3.5" fill="#D6F36A" />
      <circle cx="210" cy="210" r="3.5" fill="#D6F36A" />
    </svg>
  )
}
