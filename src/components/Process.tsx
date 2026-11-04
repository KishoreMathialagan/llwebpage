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
    if (!root.current || !track.current || reduced) return

    const context = gsap.context(() => {
      gsap.from('.process-title .line-inner', {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.process-head', start: 'top 80%' },
      })

      gsap.from('.process-step', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.process-track', start: 'top 84%' },
      })

      const matchMedia = gsap.matchMedia()

      matchMedia.add('(min-width: 900px)', () => {
        const line = track.current?.querySelector<HTMLElement>('.process-line')
        if (!line || !fill.current || !dot.current) return
        const distance = () => Math.max(0, line.offsetWidth - 10)

        gsap.fromTo(
          fill.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: track.current,
              start: 'top 72%',
              end: 'bottom 62%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        )
        gsap.fromTo(
          dot.current,
          { x: 0 },
          {
            x: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: track.current,
              start: 'top 72%',
              end: 'bottom 62%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      matchMedia.add('(max-width: 899px)', () => {
        const line = track.current?.querySelector<HTMLElement>('.process-line')
        if (!line || !fill.current || !dot.current) return
        const distance = () => Math.max(0, line.offsetHeight - 10)

        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: track.current,
              start: 'top 75%',
              end: 'bottom 68%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        )
        gsap.fromTo(
          dot.current,
          { y: 0 },
          {
            y: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: track.current,
              start: 'top 75%',
              end: 'bottom 68%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
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
