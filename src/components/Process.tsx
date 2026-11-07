import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { PROCESS } from '../data/content'

export function Process() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current || !track.current) return

    // Accessibility: graceful static fallback if prefers-reduced-motion is enabled
    if (reduced) {
      const stepEls = root.current.querySelectorAll<HTMLElement>('.process-step')
      stepEls.forEach((el) => {
        el.classList.add('is-active', 'is-passed')
        el.classList.remove('is-inactive')
      })
      if (fill.current) fill.current.style.transform = 'none'
      if (dot.current) dot.current.style.display = 'none'
      return
    }

    const context = gsap.context(() => {
      // 1. Entrance reveal for section header when scrolling toward section
      gsap.from('.process-title .line-inner', {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 85%',
        },
      })

      const matchMedia = gsap.matchMedia()

      // Dynamic navbar height calculation
      const getNavHeight = (fallback: number) => {
        const nav = document.querySelector<HTMLElement>('.site-nav')
        return nav ? nav.offsetHeight : fallback
      }

      // ======================================================================
      // DESKTOP & TABLET (Horizontal pinned timeline)
      // ======================================================================
      matchMedia.add('(min-width: 900px)', () => {
        const line = track.current?.querySelector<HTMLElement>('.process-line')
        const steps = Array.from(track.current?.querySelectorAll<HTMLElement>('.process-step') || [])
        if (!line || !fill.current || !dot.current || steps.length < 4 || !root.current) return

        const getDistance = () => Math.max(0, line.offsetWidth - 10)
        // Scroll distance calculated dynamically based on available viewport height for 4 distinct stages
        const getPinDistance = () => Math.round(window.innerHeight * 1.5)

        // Calculate exact stage collision thresholds based on pixel offset of each step relative to track
        const getThresholds = () => {
          const dist = getDistance()
          if (dist <= 0) return [0, 0.28, 0.56, 0.84]
          const base = steps[0].offsetLeft
          return steps.map((s, i) => {
            if (i === 0) return 0
            const offset = s.offsetLeft - base
            return Math.min(0.96, Math.max(0.08, offset / dist))
          })
        }

        let thresholds = getThresholds()

        const updateActiveStages = (progress: number) => {
          let activeIndex = 0
          for (let i = thresholds.length - 1; i >= 0; i--) {
            // Buffer to trigger slightly before/as the dot touches the step dot
            if (progress >= thresholds[i] - 0.015) {
              activeIndex = i
              break
            }
          }

          steps.forEach((el, i) => {
            el.style.opacity = ''
            if (i === activeIndex) {
              el.classList.add('is-active', 'is-passed')
              el.classList.remove('is-inactive')
            } else if (i < activeIndex) {
              el.classList.remove('is-active', 'is-inactive')
              el.classList.add('is-passed')
            } else {
              el.classList.remove('is-active', 'is-passed')
              el.classList.add('is-inactive')
            }
          })
        }

        // Initialize Stage 01 as active
        updateActiveStages(0)

        // Master timeline with ScrollTrigger pinning directly below the fixed navbar
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: () => `top ${getNavHeight(76)}px`,
            end: () => `+=${getPinDistance()}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              thresholds = getThresholds()
            },
            onUpdate: (self) => {
              updateActiveStages(self.progress)
            },
            onLeave: () => {
              updateActiveStages(1)
            },
            onLeaveBack: () => {
              updateActiveStages(0)
            },
          },
        })

        masterTl.fromTo(
          fill.current,
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', duration: 1 },
          0,
        )

        masterTl.fromTo(
          dot.current,
          { x: 0 },
          { x: () => getDistance(), ease: 'none', duration: 1 },
          0,
        )
      })

      // ======================================================================
      // MOBILE (Vertical pinned timeline)
      // ======================================================================
      matchMedia.add('(max-width: 899px)', () => {
        const line = track.current?.querySelector<HTMLElement>('.process-line')
        const steps = Array.from(track.current?.querySelectorAll<HTMLElement>('.process-step') || [])
        if (!line || !fill.current || !dot.current || steps.length < 4 || !root.current) return

        const getDistance = () => Math.max(0, line.offsetHeight - 10)
        const getPinDistance = () => Math.round(window.innerHeight * 1.25)

        const getThresholds = () => {
          const dist = getDistance()
          if (dist <= 0) return [0, 0.28, 0.56, 0.84]
          const base = steps[0].offsetTop
          return steps.map((s, i) => {
            if (i === 0) return 0
            const offset = s.offsetTop - base
            return Math.min(0.96, Math.max(0.08, offset / dist))
          })
        }

        let thresholds = getThresholds()

        const updateActiveStages = (progress: number) => {
          let activeIndex = 0
          for (let i = thresholds.length - 1; i >= 0; i--) {
            if (progress >= thresholds[i] - 0.015) {
              activeIndex = i
              break
            }
          }

          steps.forEach((el, i) => {
            el.style.opacity = ''
            if (i === activeIndex) {
              el.classList.add('is-active', 'is-passed')
              el.classList.remove('is-inactive')
            } else if (i < activeIndex) {
              el.classList.remove('is-active', 'is-inactive')
              el.classList.add('is-passed')
            } else {
              el.classList.remove('is-active', 'is-passed')
              el.classList.add('is-inactive')
            }
          })
        }

        updateActiveStages(0)

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: () => `top ${getNavHeight(68)}px`,
            end: () => `+=${getPinDistance()}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              thresholds = getThresholds()
            },
            onUpdate: (self) => {
              updateActiveStages(self.progress)
            },
            onLeave: () => {
              updateActiveStages(1)
            },
            onLeaveBack: () => {
              updateActiveStages(0)
            },
          },
        })

        masterTl.fromTo(
          fill.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', duration: 1 },
          0,
        )

        masterTl.fromTo(
          dot.current,
          { y: 0 },
          { y: () => getDistance(), ease: 'none', duration: 1 },
          0,
        )
      })

      return () => matchMedia.revert()
    }, root)

    return () => context.revert()
  }, [reduced])

  return (
    <section className="process section" id="process" ref={root} aria-labelledby="process-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">04</span>
            How we think
          </span>
          <span className="section-top-note">Process / Four stages</span>
        </div>

        <header className="process-head">
          <h2 className="process-title" id="process-title">
            <span className="line"><span className="line-inner">Good marketing starts</span></span>
            <span className="line"><span className="line-inner">with <em>better</em> questions.</span></span>
          </h2>
          <div className="process-note">
            <p>
              A clear, repeatable way of working — built to keep strategy present from the first
              conversation to the final optimisation.
            </p>
            <span className="process-note-detail">No black boxes. No guesswork.</span>
          </div>
        </header>

        <div className="process-track" ref={track}>
          <div className="process-line" aria-hidden="true">
            <span className="process-fill" ref={fill} />
            <span className="process-dot" ref={dot} />
          </div>

          <ol className="process-steps">
            {PROCESS.map((stage) => (
              <li className="process-step" key={stage.index}>
                <span className="process-index">{stage.index}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="process-foot">
          <span className="process-loop" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="17" stroke="rgba(243,241,233,.14)" strokeDasharray="2.5 5" />
              <path
                d="M33.5 9.2A17 17 0 1 0 41 24"
                stroke="rgba(214,243,106,.85)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M34.8 4.5 35 12l-7.3.2"
                stroke="rgba(214,243,106,.85)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p>Then we go again — informed by what we learned.</p>
        </div>
      </div>
    </section>
  )
}
