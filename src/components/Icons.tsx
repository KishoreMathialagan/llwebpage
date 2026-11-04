import type { SVGProps } from 'react'

export function ArrowUpRight({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M5 15L15 5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M6.5 5H15V13.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowRight({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 12" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M0 6H20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M15 1L20.2 6L15 11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

export function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      LeadLoom
      <svg className="wordmark-mark" viewBox="0 0 24 14" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="7" rx="11" ry="4.6" transform="rotate(-28 12 7)" stroke="currentColor" strokeWidth="0.9" />
        <ellipse
          className="wordmark-mark-secondary"
          cx="12"
          cy="7"
          rx="11"
          ry="4.6"
          transform="rotate(36 12 7)"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <circle cx="21.2" cy="2.2" r="1.5" fill="var(--accent)" />
      </svg>
    </span>
  )
}

export const SERVICE_GLYPHS = {
  orbit: (
    <>
      <ellipse className="glyph-spin" cx="32" cy="32" rx="23" ry="9" />
      <ellipse className="glyph-spin-reverse" cx="32" cy="32" rx="23" ry="9" transform="rotate(62 32 32)" />
      <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  signal: (
    <>
      <path d="M12 44V32M23 44V20M34 44V27M45 44V14M56 44V24" className="glyph-bars" />
      <path d="M8 44H58" opacity=".35" />
    </>
  ),
  wave: (
    <>
      <path d="M6 32c6-14 12-14 18 0s12 14 18 0 8-10 16-4" className="glyph-path" />
      <path d="M6 41c6-14 12-14 18 0s12 14 18 0 8-10 16-4" opacity=".3" />
    </>
  ),
  search: (
    <>
      <circle cx="28" cy="28" r="16" />
      <path d="M39 39L55 55" />
      <circle cx="28" cy="28" r="5" opacity=".45" />
    </>
  ),
  mark: (
    <>
      <path d="M32 7v50M7 32h50" opacity=".35" />
      <path d="M12 12l40 40M52 12L12 52" />
      <circle cx="32" cy="32" r="10" className="glyph-spin" />
    </>
  ),
  frame: (
    <>
      <rect x="9" y="13" width="46" height="38" rx="1" />
      <path d="M9 24h46M23 24v27" opacity=".5" />
      <path d="M31 36h16M31 42h10" />
    </>
  ),
} as const
