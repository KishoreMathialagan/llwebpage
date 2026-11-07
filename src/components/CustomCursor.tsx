import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Variant = 'default' | 'link' | 'explore' | 'cta' | 'field'
type Mode = 'dark' | 'lime' | 'light'

function parseColor(colorStr: string | null | undefined): { r: number; g: number; b: number; a: number } | null {
  if (!colorStr || colorStr === 'none' || colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
    return null
  }
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1)
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
    const num = parseInt(hex, 16)
    if (isNaN(num)) return null
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 }
  }
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (m) {
    return {
      r: parseInt(m[1], 10),
      g: parseInt(m[2], 10),
      b: parseInt(m[3], 10),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1,
    }
  }
  return null
}

function classifyRgb(r: number, g: number, b: number): Mode {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  const l = (max + min) / (2 * 255)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  // Lime-green detection: high green, high red, lower blue, hue in 58°-102° range, saturated
  if (h >= 58 && h <= 102 && s >= 0.35 && l >= 0.4) {
    return 'lime'
  }

  // Light detection: high luminance
  if (lum >= 0.5) {
    return 'light'
  }

  // Otherwise dark
  return 'dark'
}

function detectBackgroundMode(el: Element | null): Mode {
  if (!el) return 'dark'

  // 1. Explicit data-cursor-theme attribute (fast O(1) check)
  const themed = el.closest<HTMLElement>('[data-cursor-theme]')
  if (themed) {
    const val = themed.getAttribute('data-cursor-theme')
    if (val === 'light' || val === 'lime' || val === 'dark') {
      return val
    }
  }

  // 2. High-specificity component overrides
  // Primary buttons and lime CTAs are lime, even when nested inside dark panels
  if (el.closest('.btn-primary, .nav-cta, [data-cursor-lime]')) {
    return 'lime'
  }

  // Dark panels (contact form panel, drawers, dialogs, mobile menu)
  if (el.closest('.contact-form, .drawer-panel, .dialog-panel, .mobile-menu-shell')) {
    return 'dark'
  }

  // Contact section & expertise strip are lime
  if (el.closest('.contact, .expertise-strip')) {
    return 'lime'
  }

  // 3. Computed style & SVG fill inspection walking up the DOM tree
  let curr: Element | null = el
  let depth = 0
  while (curr && depth < 12) {
    depth++

    // Check SVG fills (e.g. Aurelia rect fill="#E7E0D0")
    if (curr instanceof SVGElement) {
      const fillAttr = curr.getAttribute('fill')
      if (fillAttr && fillAttr !== 'none' && !fillAttr.startsWith('url(')) {
        const color = parseColor(fillAttr)
        if (color && color.a > 0.4) {
          return classifyRgb(color.r, color.g, color.b)
        }
      }
    }

    if (curr instanceof HTMLElement) {
      const bg = window.getComputedStyle(curr).backgroundColor
      const color = parseColor(bg)
      if (color && color.a > 0.4) {
        return classifyRgb(color.r, color.g, color.b)
      }
    }

    if (curr === document.body || curr === document.documentElement) break
    curr = curr.parentElement
  }

  return 'dark'
}

export function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    // Only disable by default on purely touch-only mobile devices with coarse pointer and no hover
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    return !isTouchOnly
  })
  const [variant, setVariant] = useState<Variant>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // If explicitly pure touch device with coarse pointer, don't auto-activate unless a real mouse moves
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchOnly && !enabled) {
      const enableOnRealPointer = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') {
          setEnabled(true)
          window.removeEventListener('pointermove', enableOnRealPointer)
        }
      }
      window.addEventListener('pointermove', enableOnRealPointer, { passive: true })
      return () => window.removeEventListener('pointermove', enableOnRealPointer)
    }

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dot = { x: target.x, y: target.y }
    const ring = { x: target.x, y: target.y }
    let hasMoved = false
    let frame = 0
    let currentMode: Mode = 'dark'
    let lastTarget: EventTarget | null = null

    // Set initial data-mode
    if (containerRef.current) {
      containerRef.current.setAttribute('data-mode', 'dark')
    }

    const updateMode = (el: Element | null) => {
      if (!el) return
      const newMode = detectBackgroundMode(el)
      if (newMode !== currentMode) {
        currentMode = newMode
        if (containerRef.current) {
          containerRef.current.setAttribute('data-mode', newMode)
        }
      }
    }

    const render = () => {
      if (reduced) {
        dot.x = target.x
        dot.y = target.y
        ring.x = target.x
        ring.y = target.y
      } else {
        dot.x += (target.x - dot.x) * 0.55
        dot.y += (target.y - dot.y) * 0.55
        ring.x += (target.x - ring.x) * 0.18
        ring.y += (target.y - ring.y) * 0.18
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return

      if (!hasMoved) {
        hasMoved = true
        dot.x = event.clientX
        dot.y = event.clientY
        ring.x = event.clientX
        ring.y = event.clientY
      }

      target.x = event.clientX
      target.y = event.clientY

      if (containerRef.current && !containerRef.current.classList.contains('is-visible')) {
        containerRef.current.classList.add('is-visible')
      }
      setVisible(true)

      if (event.target !== lastTarget) {
        lastTarget = event.target
        updateMode(event.target as Element)
      }
    }

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const targetEl = event.target as Element | null
      if (targetEl) {
        lastTarget = targetEl
        updateMode(targetEl)
      }
      const element = targetEl?.closest<HTMLElement>(
        'a, button, input, textarea, select, [data-cursor]',
      )
      if (!element) {
        setVariant('default')
        return
      }
      if (element.matches('input, textarea, select')) {
        setVariant('field')
        return
      }
      const explicit = element.getAttribute('data-cursor')
      if (explicit === 'explore') setVariant('explore')
      else if (explicit === 'cta') setVariant('cta')
      else setVariant('link')
    }

    let scrollTicking = false
    const onScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true
        requestAnimationFrame(() => {
          scrollTicking = false
          const el = document.elementFromPoint(target.x, target.y)
          if (el) {
            updateMode(el)
          }
        })
      }
    }

    const onLeave = () => {
      if (containerRef.current) {
        containerRef.current.classList.remove('is-visible')
      }
      setVisible(false)
    }

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (containerRef.current) {
        containerRef.current.classList.add('is-visible')
      }
      setVisible(true)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced, enabled])

  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.textContent = variant === 'explore' ? 'Explore' : ''
    }
  }, [variant])

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      className={`cursor ${visible ? 'is-visible' : ''}`}
      data-variant={variant}
      data-mode="dark"
      aria-hidden="true"
    >
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <span className="cursor-label" ref={labelRef} />
      </div>
    </div>
  )
}
