import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Logo } from './Logo'

interface PreloaderProps {
  onStartExit?: () => void
  onComplete: () => void
}

export function Preloader({ onStartExit, onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const maskStop1Ref = useRef<SVGStopElement>(null)
  const maskStop2Ref = useRef<SVGStopElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  }))

  useEffect(() => {
    const onResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock scroll while preloader is active and clean up initial static fallback
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const fallbackLoader = document.getElementById('loader')
    if (fallbackLoader) {
      fallbackLoader.style.display = 'none'
    }

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overflow = originalBodyOverflow
    }
  }, [])

  // Grid calculation: wide spacing for architectural technical blueprint aesthetic
  const isMobile = dimensions.width < 768
  const cellSize = isMobile ? 64 : 88
  const cols = Math.ceil(dimensions.width / cellSize) + 1
  const rows = Math.ceil(dimensions.height / cellSize) + 1

  // Vertical lines from bottom (y=height) to top (y=0)
  const verticalLines: Array<{ id: string; x: number; dist: number }> = []
  for (let i = 0; i <= cols; i++) {
    const x = i * cellSize
    const dist = dimensions.width > 0 ? x / dimensions.width : 0
    verticalLines.push({ id: `v-${i}`, x, dist })
  }

  // Horizontal lines from left (x=0) to right (x=width), ordered from bottom up
  const horizontalLines: Array<{ id: string; y: number; dist: number }> = []
  for (let j = 0; j <= rows; j++) {
    const y = dimensions.height - j * cellSize
    const dist = dimensions.height > 0 ? (j * cellSize) / dimensions.height : 0
    horizontalLines.push({ id: `h-${j}`, y, dist })
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Accessibility: immediate completion if user prefers reduced motion
    if (reduced) {
      if (logoRef.current) logoRef.current.style.opacity = '1'
      if (taglineRef.current) taglineRef.current.style.opacity = '1'
      const timer = window.setTimeout(() => {
        onStartExit?.()
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete,
        })
      }, 400)
      return () => window.clearTimeout(timer)
    }

    const ctx = gsap.context(() => {
      const vLineEls = containerRef.current?.querySelectorAll<SVGLineElement>('.grid-line-v') || []
      const hLineEls = containerRef.current?.querySelectorAll<SVGLineElement>('.grid-line-h') || []

      // Master GSAP timeline for progressive graph grid construction and brand reveal
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      })

      // 1. Diagonal mask reveal progression from bottom-left (0, 100%) to top-right (100%, 0%)
      const maskTracker = { progress: 0 }
      tl.to(
        maskTracker,
        {
          progress: 1.15,
          duration: 1.5,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (maskStop1Ref.current && maskStop2Ref.current) {
              const p = maskTracker.progress
              const s1 = Math.max(0, Math.min(100, (p - 0.12) * 100))
              const s2 = Math.max(0, Math.min(100, (p + 0.12) * 100))
              maskStop1Ref.current.setAttribute('offset', `${s1.toFixed(1)}%`)
              maskStop2Ref.current.setAttribute('offset', `${s2.toFixed(1)}%`)
            }
          },
        },
        0,
      )

      // 2. Staggered vertical lines drawing bottom-to-top, ordered by distance from bottom-left
      vLineEls.forEach((line, i) => {
        const normDist = verticalLines[i]?.dist || 0
        const delay = normDist * 0.72
        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          delay,
        )
      })

      // 3. Staggered horizontal lines drawing left-to-right, ordered by distance from bottom-left
      hLineEls.forEach((line, j) => {
        const normDist = horizontalLines[j]?.dist || 0
        const delay = normDist * 0.72
        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          delay,
        )
      })

      // 4. Centered Logo and Wordmark fade in with slight upward movement
      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
          0.85,
        )
      }

      // 5. Bottom Tagline subtle opacity reveal
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: 'power2.out' },
          1.2,
        )
      }

      // 6. Hold fully constructed blueprint preloader briefly (at 2.2s)
      tl.add(() => {
        onStartExit?.()
      }, 2.2)

      // 7. Smooth exit transition into homepage
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.75,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete()
          },
        },
        2.2,
      )
    }, containerRef)

    return () => ctx.revert()
  }, [reduced, dimensions.width, dimensions.height])

  return (
    <div
      ref={containerRef}
      id="preloader-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#080908',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      {/* Architectural Graph Grid */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          {/* Diagonal mask from bottom-left (0, 100%) to top-right (100%, 0%) */}
          <linearGradient id="preloader-diag-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop ref={maskStop1Ref} offset="0%" stopColor="#ffffff" />
            <stop ref={maskStop2Ref} offset="0%" stopColor="#000000" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <mask id="preloader-grid-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#preloader-diag-grad)" />
          </mask>
        </defs>

        <g mask="url(#preloader-grid-mask)">
          {/* Vertical Lines */}
          {verticalLines.map((line) => (
            <line
              key={line.id}
              className="grid-line-v"
              x1={line.x}
              y1={dimensions.height}
              x2={line.x}
              y2={0}
              stroke="rgba(243, 241, 233, 0.075)"
              strokeWidth="0.45"
              strokeDasharray={dimensions.height}
              strokeDashoffset={dimensions.height}
            />
          ))}

          {/* Horizontal Lines */}
          {horizontalLines.map((line) => (
            <line
              key={line.id}
              className="grid-line-h"
              x1={0}
              y1={line.y}
              x2={dimensions.width}
              y2={line.y}
              stroke="rgba(243, 241, 233, 0.075)"
              strokeWidth="0.45"
              strokeDasharray={dimensions.width}
              strokeDashoffset={dimensions.width}
            />
          ))}
        </g>
      </svg>

      {/* Centered ANTARA Wordmark & Accent Pill */}
      <div
        ref={logoRef}
        className="loader-inner"
        style={{
          opacity: 0,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo
          variant="wordmark"
          className="w-[190px] sm:w-[260px] md:w-[320px] h-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          title="ANTARA"
        />
      </div>

      {/* Bottom Tagline */}
      <div
        ref={taglineRef}
        className="loader-meta"
        style={{
          opacity: 0,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: '9vh',
          zIndex: 2,
          fontFamily: "'Manrope', system-ui, sans-serif",
          fontSize: '9px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#6E716B',
          whiteSpace: 'nowrap',
        }}
      >
        INDEPENDENT DIGITAL GROWTH AGENCY
      </div>
    </div>
  )
}
