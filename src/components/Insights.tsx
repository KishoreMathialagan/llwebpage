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
        className="dialog-insight"
      >
        {selected && (
          <article className="insight-dialog">
            <div className="insight-dialog-head">
              <span className="eyebrow">{selected.topic}</span>
              <span className="insight-dialog-index">Note {selected.index}</span>
            </div>
            <h3>{selected.title}</h3>
            <div className="insight-dialog-body">
              {selected.excerpt.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="insight-dialog-takeaway">
              <span className="eyebrow">In short</span>
              <p>{selected.takeaway}</p>
            </div>
            <div className="insight-dialog-actions">
              <button type="button" className="btn btn-primary" onClick={goToContact} data-cursor="cta">
                <span>Discuss this with us</span>
                <span className="btn-arrow"><ArrowUpRight /></span>
              </button>
              <span>LeadLoom / Notes</span>
            </div>
          </article>
        )}
      </Dialog>
    </section>
  )
}
