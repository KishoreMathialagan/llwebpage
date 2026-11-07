import type { SVGProps } from 'react'
import {
  SYMBOL_PATHS,
  FULL_LOCKUP_PATHS,
  WORDMARK_PATHS,
  NAV_LOCKUP_PATHS,
} from './LogoPaths'

export type LogoVariant = 'full' | 'symbol' | 'wordmark' | 'nav'
export type LogoTheme = 'dark' | 'light'

export interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant
  theme?: LogoTheme
  className?: string
  title?: string
}

/**
 * ANTARA Official Brand Logo Component
 *
 * Implements the approved brand identity system across all touchpoints:
 * - variant="full": Complete lockup (Symbol + ANTARA + CREATIVE STUDIO descriptor + Lime accent)
 * - variant="symbol": Geometric symbol only (White/Dark arch + Lime diagonal pill)
 * - variant="wordmark": ANTARA letterforms only
 * - variant="nav": Compact horizontal combination (Symbol + ANTARA wordmark) for headers
 *
 * Supports theme="dark" (default, for dark surfaces: #F1F0E9) and theme="light" (for light surfaces: #080A07).
 * Lime accent is strictly preserved across all variations (#B9D94A).
 */
export function Logo({
  variant = 'nav',
  theme = 'dark',
  className = '',
  title = 'ANTARA',
  ...props
}: LogoProps) {
  const isLight = theme === 'light'
  const primaryColor = isLight ? '#080A07' : '#F1F0E9'
  const limeColor = '#B9D94A'

  if (variant === 'symbol') {
    return (
      <svg
        viewBox={SYMBOL_PATHS.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`antara-logo antara-logo-symbol ${className}`}
        role="img"
        aria-label={title}
        {...props}
      >
        <path
          className="antara-symbol-arch"
          d={SYMBOL_PATHS.white}
          fill={primaryColor}
          fillRule="evenodd"
        />
        <path
          className="antara-symbol-pill"
          d={SYMBOL_PATHS.lime}
          fill={limeColor}
        />
      </svg>
    )
  }

  if (variant === 'wordmark') {
    return (
      <svg
        viewBox={WORDMARK_PATHS.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`antara-logo antara-logo-wordmark ${className}`}
        role="img"
        aria-label={title}
        {...props}
      >
        <path
          className="antara-wordmark-text"
          d={WORDMARK_PATHS.white}
          fill={primaryColor}
          fillRule="evenodd"
        />
        {WORDMARK_PATHS.lime && (
          <path
            className="antara-wordmark-pill"
            d={WORDMARK_PATHS.lime}
            fill={limeColor}
          />
        )}
      </svg>
    )
  }

  if (variant === 'nav') {
    return (
      <svg
        viewBox={NAV_LOCKUP_PATHS.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`antara-logo antara-logo-nav ${className}`}
        role="img"
        aria-label={title}
        {...props}
      >
        <g className="antara-nav-symbol">
          <path
            className="antara-symbol-arch"
            d={NAV_LOCKUP_PATHS.symbolWhite}
            fill={primaryColor}
            fillRule="evenodd"
          />
          <path
            className="antara-symbol-pill"
            d={NAV_LOCKUP_PATHS.symbolLime}
            fill={limeColor}
          />
        </g>
        <g
          className="antara-nav-wordmark"
          transform={`translate(${NAV_LOCKUP_PATHS.wordmarkOffset}, 0)`}
        >
          <path
            className="antara-wordmark-text"
            d={NAV_LOCKUP_PATHS.wordmark}
            fill={primaryColor}
            fillRule="evenodd"
          />
        </g>
      </svg>
    )
  }

  // Default: variant === 'full'
  return (
    <svg
      viewBox={FULL_LOCKUP_PATHS.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`antara-logo antara-logo-full ${className}`}
      role="img"
      aria-label={title}
      {...props}
    >
      <path
        className="antara-lockup-primary"
        d={FULL_LOCKUP_PATHS.white}
        fill={primaryColor}
        fillRule="evenodd"
      />
      <path
        className="antara-lockup-lime"
        d={FULL_LOCKUP_PATHS.lime}
        fill={limeColor}
      />
    </svg>
  )
}

