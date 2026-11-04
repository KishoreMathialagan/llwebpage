import { Suspense, lazy, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowUpRight } from './Icons'
import { scrollToId } from '../lib/scroll'

const HeroScene = lazy(() =>
  import('./HeroScene').then((module) => ({ default: module.HeroScene })),
)

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ready || !root.current) return

    const context = gsap.context(() => {
      if (reduced) {
        gsap.set(['.hero-label', '.hero-title .line-inner', '.hero-bottom > *', '.hero-side', '.hero-scroll'], {
          opacity: 1,
          y: 0,
        })
        return
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('.hero-label', { opacity: 0, y: 14, duration: 0.8 }, 0)
        .from('.hero-title .line-inner', { yPercent: 114, duration: 1.15, stagger: 0.085 }, 0.08)
        .from('.hero-title .hero-period', { opacity: 0, duration: 0.5 }, 0.95)
        .from('.hero-bottom .hero-reveal', { opacity: 0, y: 20, duration: 0.9, stagger: 0.09 }, 0.55)
        .from('.hero-side, .hero-scroll, .hero-meta-line', { opacity: 0, duration: 1 }, 0.85)
    }, root)

    return () => context.revert()
  }, [ready, reduced])

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-atmosphere-grid" />
        <div className="hero-atmosphere-glow" />
      </div>

      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-shell shell">
        <div className="hero-topline">
          <p className="hero-label">
            <span className="status-dot" aria-hidden="true" />
            Independent digital growth agency
          </p>
          <p className="hero-topline-right">
            Strategy <span aria-hidden="true">/</span> Creativity <span aria-hidden="true">/</span> Digital
          </p>
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="line">
            <span className="line-inner">Make Your Brand</span>
          </span>
          <span className="line line-serif">
            <span className="line-inner"><em>Impossible</em> to</span>
          </span>
          <span className="line">
            <span className="line-inner">Ignore<span className="hero-period">.</span></span>
          </span>
        </h1>

        <div className="hero-bottom">
          <div className="hero-actions hero-reveal">
            <a className="btn btn-primary" href="#contact" data-cursor="cta">
              <span>Start a Conversation</span>
              <span className="btn-arrow">
                <ArrowUpRight />
              </span>
            </a>
            <button
              type="button"
              className="link-arrow hero-secondary"
              onClick={() => scrollToId('services')}
            >
              Explore Our Approach
              <ArrowUpRight />
            </button>
          </div>

          <div className="hero-aside hero-reveal">
            <p className="hero-copy">
              We bring strategy, creativity and digital intelligence together to help ambitious
              businesses attract attention, build connections and grow.
            </p>
            <div className="hero-meta-line">
              <span>Growth is not accidental</span>
              <span className="hero-meta-dot" aria-hidden="true" />
              <span>It&rsquo;s engineered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-side" aria-hidden="true">
        <span className="hero-side-line" />
        <span>Turning attention into opportunity</span>
      </div>

      <button
        type="button"
        className="hero-scroll"
        onClick={() => scrollToId('about')}
        aria-label="Scroll to the LeadLoom approach"
      >
        <span className="hero-scroll-track" aria-hidden="true"><i /></span>
        <span>Scroll to explore</span>
      </button>
    </section>
  )
}
