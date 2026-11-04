import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Variant = 'default' | 'link' | 'explore' | 'cta' | 'field'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<Variant>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!media.matches || reduced) return setEnabled(false)

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dot = { x: target.x, y: target.y }
    const ring = { x: target.x, y: target.y }
    let frame = 0

    const render = () => {
      dot.x += (target.x - dot.x) * 0.55
      dot.y += (target.y - dot.y) * 0.55
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
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
      target.x = event.clientX
      target.y = event.clientY
      setVisible(true)
    }

    const onOver = (event: PointerEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>(
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

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.textContent = variant === 'explore' ? 'Explore' : ''
    }
  }, [variant])

  if (!enabled) return null

  return (
    <div className={`cursor ${visible ? 'is-visible' : ''}`} data-variant={variant} aria-hidden="true">
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <span className="cursor-label" ref={labelRef} />
      </div>
    </div>
  )
}
