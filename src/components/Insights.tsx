import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { INSIGHTS, type Insight } from '../data/content'
import { ArrowUpRight } from './Icons'
import { Dialog } from './Dialog'
import { scrollToId } from '../lib/scroll'

export function Insights() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<Insight | null>(null)

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      gsap.from('.insights-title .line-inner', {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.insights-head', start: 'top 82%' },
      })
      gsap.from('.insight-row', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.insights-list', start: 'top 88%' },
      })
    }, root)
    return () => context.revert()
  }, [reduced])

  const goToContact = () => {
    setSelected(null)
    window.setTimeout(() => scrollToId('contact'), 120)
  }

  const currentIndex = selected ? INSIGHTS.findIndex((i) => i.index === selected.index) : -1
  const prevInsight = currentIndex > 0 ? INSIGHTS[currentIndex - 1] : INSIGHTS[INSIGHTS.length - 1]
  const nextInsight = currentIndex < INSIGHTS.length - 1 ? INSIGHTS[currentIndex + 1] : INSIGHTS[0]

  return (
    <section className="insights section" id="insights" ref={root} aria-labelledby="insights-title">
      <div className="shell">
        <div className="section-top section-top-light">
          <span className="label">
            <span className="label-index">07</span>
            Insights
          </span>
          <span className="section-top-note">Notes / Thinking out loud</span>
        </div>

        <header className="insights-head">
          <h2 className="insights-title" id="insights-title">
            <span className="line"><span className="line-inner">Notes on attention,</span></span>
            <span className="line"><span className="line-inner">trust and growth.</span></span>
          </h2>
          <p className="insights-intro">
            Short observations from the work. Not hot takes — just the ideas we find ourselves
            returning to.
          </p>
        </header>

        <div className="insights-list">
          {INSIGHTS.map((insight) => (
            <button
              type="button"
              className="insight-row"
              key={insight.index}
              onClick={() => setSelected(insight)}
              aria-label={`Read note: ${insight.title}`}
            >
              <span className="insight-index" aria-hidden="true">{insight.index}</span>
              <span className="insight-main">
                <span className="insight-topic">{insight.topic}</span>
                <span className="insight-title">{insight.title}</span>
              </span>
              <span className="insight-action">
                Read note
                <span className="insight-arrow" aria-hidden="true"><ArrowUpRight /></span>
              </span>
            </button>
          ))}
        </div>

        <div className="insights-foot">
          <span>More notes will appear here as we publish them.</span>
          <span className="insights-foot-mark" aria-hidden="true">✳</span>
        </div>
      </div>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected ? `Note: ${selected.title}` : 'Note'}
        category={selected ? `${selected.topic} / Perspectives` : 'Observation'}
        className="drawer-insight"
        footer={
          selected && (
            <>
              <div className="drawer-nav">
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => setSelected(prevInsight)}
                  aria-label="Previous note"
                  title="Previous note"
                >
                  ←
                </button>
                <span className="drawer-index-indicator">Note {selected.index} / 04</span>
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => setSelected(nextInsight)}
                  aria-label="Next note"
                  title="Next note"
                >
                  →
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={goToContact}
                data-cursor="cta"
              >
                <span>Discuss this with us</span>
                <span className="btn-arrow"><ArrowUpRight /></span>
              </button>
            </>
          )
        }
      >
        {selected && (
          <article className="insight-drawer-body">
            <div className="insight-drawer-meta-row">
              <span className="eyebrow">{selected.topic}</span>
              <span className="insight-drawer-index-pill">Note {selected.index}</span>
            </div>
            <h3 className="insight-drawer-title">{selected.title}</h3>
            <div className="insight-drawer-paragraphs">
              {selected.excerpt.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="insight-drawer-takeaway">
              <span className="eyebrow">In short</span>
              <p>{selected.takeaway}</p>
            </div>
          </article>
        )}
      </Dialog>
    </section>
  )
}
