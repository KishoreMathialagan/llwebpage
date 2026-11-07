import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DIFFERENTIATORS } from '../data/content'

export function WhyLeadloom() {
  const root = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const activeIndexRef = useRef<number>(-1)

  useEffect(() => {
    if (!root.current) return

    // If reduced motion is requested, activate all items for full readability and exit
    if (reduced) {
      const items = root.current.querySelectorAll<HTMLElement>('.why-item')
      items.forEach((item) => item.classList.add('is-active', 'is-active-step'))
      return
    }

    let recalculate: () => void = () => {}

    const context = gsap.context(() => {
      // 1. Entrance reveals for section header
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

      // 2. ONE central scroll activation controller based on actual DOM positions
      const sectionEl = root.current
      if (!sectionEl) return
      const items = Array.from(sectionEl.querySelectorAll<HTMLElement>('.why-item'))
      if (items.length === 0) return

      const setActiveIndex = (newIndex: number) => {
        if (newIndex === activeIndexRef.current) return
        activeIndexRef.current = newIndex
        items.forEach((item, i) => {
          if (i === newIndex) {
            item.classList.add('is-active', 'is-active-step')
          } else {
            item.classList.remove('is-active', 'is-active-step')
          }
        })
      }

      recalculate = () => {
        const activationY = window.innerHeight * 0.65
        const sectionRect = sectionEl.getBoundingClientRect()

        // When scrolling completely past the section at the bottom, remove active state
        if (sectionRect.bottom < 0) {
          setActiveIndex(-1)
          return
        }

        // Conceptual logic: activeIndex = last item whose top position is above the activation line
        let activeIndex = -1
        for (let i = 0; i < items.length; i++) {
          const rect = items[i].getBoundingClientRect()
          if (rect.top <= activationY) {
            activeIndex = i
          } else {
            break
          }
        }

        setActiveIndex(activeIndex)
      }

      // Single ScrollTrigger to monitor scroll and refresh events
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: recalculate,
        onRefresh: recalculate,
        invalidateOnRefresh: true,
      })

      window.addEventListener('scroll', recalculate, { passive: true })
      window.addEventListener('resize', recalculate, { passive: true })

      // Initial execution
      recalculate()

      // 3. Footer quote reveal
      gsap.from('.why-quote', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.why-quote', start: 'top 88%' },
      })

      // 4. Orbit rotor animation
      gsap.to('.why-orbit-rotor', {
        rotate: 360,
        duration: 55,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center',
      })
    }, root)

    return () => {
      window.removeEventListener('scroll', recalculate)
      window.removeEventListener('resize', recalculate)
      context.revert()
    }
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
            <p>
              We are a small, senior team by design. That means direct thinking, fewer layers and a
              genuine stake in the outcome.
            </p>
          </div>
        </header>

        <ol className="why-list" ref={listRef}>
          {DIFFERENTIATORS.map((item, index) => (
            <li className={`why-item why-item-${index + 1}`} key={item.index}>
              <div className="why-item-inner">
                <span className="why-index" aria-hidden="true">{item.index}</span>
                <div className="why-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="why-mark" aria-hidden="true">+</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="why-quote">
          <p>
            We would rather build something that lasts than something that merely performs.
          </p>
          <span className="why-quote-credit">The ANTARA view</span>
        </div>
      </div>
    </section>
  )
}
