import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { EXPERTISE_STRIP } from '../data/content'

export function BrandStatement() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current || reduced) return

    const context = gsap.context(() => {
      gsap.from('.statement-title .line-inner', {
        yPercent: 112,
        duration: 1.15,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.statement-title',
          start: 'top 82%',
        },
      })

      gsap.from('.statement-aside, .statement-figure', {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.statement-body',
          start: 'top 72%',
        },
      })

      gsap.to('.statement-orbit-ring', {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      })
    }, root)

    return () => {
      context.revert()
      ScrollTrigger.refresh()
    }
  }, [reduced])

  const strip = [...EXPERTISE_STRIP, ...EXPERTISE_STRIP, ...EXPERTISE_STRIP, ...EXPERTISE_STRIP]

  return (
    <section className="statement section" id="about" ref={root} aria-labelledby="statement-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">02</span>
            The LeadLoom approach
          </span>
          <span className="section-top-note">A point of view</span>
        </div>

        <div className="statement-body">
          <h2 className="statement-title" id="statement-title">
            <span className="line"><span className="line-inner">Attention gets you</span></span>
            <span className="line"><span className="line-inner">noticed<span className="accent-mark">*</span></span></span>
            <span className="line"><span className="line-inner">Strategy makes</span></span>
            <span className="line"><span className="line-inner">you <em>matter.</em></span></span>
          </h2>

          <div className="statement-aside">
            <div className="statement-figure" aria-hidden="true">
              <svg className="statement-orbit" viewBox="0 0 120 120" fill="none">
                <ellipse cx="60" cy="60" rx="54" ry="21" stroke="rgba(243,241,233,.18)" />
                <ellipse
                  className="statement-orbit-ring"
                  cx="60"
                  cy="60"
                  rx="54"
                  ry="21"
                  stroke="rgba(214,243,106,.5)"
                  transform="rotate(58 60 60)"
                />
                <circle cx="60" cy="60" r="3" fill="#D6F36A" />
                <circle cx="111" cy="38" r="2" fill="#F3F1E9" />
              </svg>
              <span className="statement-figure-caption">Fig. 01 — Attention, directed</span>
            </div>

            <p className="statement-copy">
              Digital growth is not about being everywhere. It&rsquo;s about showing up in the right
              places, with the right message, for the right audience.
            </p>
            <p className="statement-small">
              <span className="accent-mark">*</span> Notice is the beginning. Meaning is what makes
              people stay.
            </p>
          </div>
        </div>
      </div>

      <div className="expertise-strip" aria-hidden="true">
        <div className="expertise-track">
          {strip.map((item, index) => (
            <span className="expertise-item" key={`${item}-${index}`}>
              {item}
              <span className="expertise-star">✳</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
