import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DIFFERENTIATORS } from '../data/content'

export function WhyLeadloom() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      gsap.from('.why-title .line-inner', {
        yPercent: 112,
        duration: 1.1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.why-head', start: 'top 82%' },
      })
      gsap.from('.why-head-aside', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        scrollTrigger: { trigger: '.why-head', start: 'top 74%' },
      })

      // Progressive vertical storytelling sequence
      const items = gsap.utils.toArray<HTMLElement>('.why-item')
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.35, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: item,
              start: 'top 78%',
              end: 'bottom 40%',
              toggleActions: 'play reverse play reverse',
              toggleClass: { targets: item, className: 'is-active-step' },
            },
          },
        )
      })

      gsap.from('.why-quote', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.why-quote', start: 'top 88%' },
      })
      gsap.to('.why-orbit-rotor', {
        rotate: 360,
        duration: 55,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      })
    }, root)
    return () => context.revert()
  }, [reduced])

  return (
    <section className="why section" id="why" ref={root} aria-labelledby="why-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">06</span>
            Why we exist
          </span>
          <span className="section-top-note">Principles / Non-negotiables</span>
        </div>

        <header className="why-head">
          <h2 className="why-title" id="why-title">
            <span className="line"><span className="line-inner">Not louder marketing.</span></span>
            <span className="line"><span className="line-inner"><em>Smarter</em> marketing.</span></span>
          </h2>
          <div className="why-head-aside">
            <svg className="why-orbit" viewBox="0 0 140 140" fill="none" aria-hidden="true">
              <circle cx="70" cy="70" r="54" stroke="rgba(243,241,233,.1)" />
              <ellipse cx="70" cy="70" rx="62" ry="22" stroke="rgba(243,241,233,.22)" />
              <g className="why-orbit-rotor">
                <ellipse
                  cx="70"
                  cy="70"
                  rx="62"
                  ry="22"
                  stroke="rgba(214,243,106,.62)"
                  strokeWidth="1.15"
                  transform="rotate(56 70 70)"
                />
                <circle cx="104.7" cy="18.6" r="3" fill="#D6F36A" />
              </g>
              <circle cx="70" cy="70" r="2" fill="rgba(243,241,233,.55)" />
            </svg>
            <p>
              We are a small, senior team by design. That means direct thinking, fewer layers and a
              genuine stake in the outcome.
            </p>
          </div>
        </header>

        <ol className="why-list">
          {DIFFERENTIATORS.map((item, index) => (
            <li className={`why-item why-item-${index + 1}`} key={item.index}>
              <span className="why-index" aria-hidden="true">{item.index}</span>
              <div className="why-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <span className="why-mark" aria-hidden="true">+</span>
            </li>
          ))}
        </ol>

        <div className="why-quote">
          <p>
            We would rather build something that lasts than something that merely performs.
          </p>
          <span className="why-quote-credit">The LeadLoom view</span>
        </div>
      </div>
    </section>
  )
}
