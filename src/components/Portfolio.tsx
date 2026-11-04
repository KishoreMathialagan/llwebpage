import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { PROJECTS, type Project } from '../data/content'
import { ArrowUpRight } from './Icons'
import { ProjectArt } from './ProjectArt'
import { Dialog } from './Dialog'
import { scrollToId } from '../lib/scroll'

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  return (
    <button
      type="button"
      className={`project-card ${project.ratio}`}
      onClick={() => onOpen(project)}
      data-cursor="explore"
      aria-label={`${project.title}, ${project.category}, ${project.industry}. ${project.note}. Open concept details.`}
    >
      <span className="project-meta">
        <span className="project-index">{project.index}</span>
        <span className="project-category">{project.category}</span>
        <span className="project-industry">{project.industry}</span>
      </span>

      <span className="project-visual">
        <span className="project-visual-inner">
          <ProjectArt variant={project.art} />
        </span>
        <span className="project-view" aria-hidden="true">
          <span>View concept</span>
          <ArrowUpRight />
        </span>
      </span>

      <span className="project-info">
        <span className="project-title-row">
          <span className="project-title">{project.title}</span>
          <span className="project-arrow" aria-hidden="true"><ArrowUpRight /></span>
        </span>
        <span className="project-description">{project.description}</span>
      </span>

      <span className="project-note">{project.note}</span>
    </button>
  )
}

export function Portfolio() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<Project | null>(null)

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      gsap.from('.work-title .line-inner', {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-head', start: 'top 80%' },
      })

      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.fromTo(
          card.querySelector('.project-visual'),
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          },
        )
        gsap.from(card.querySelector('.project-info'), {
          opacity: 0,
          y: 18,
          duration: 0.8,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 82%' },
        })
      })
    }, root)

    return () => context.revert()
  }, [reduced])

  const goToContact = () => {
    setSelected(null)
    window.setTimeout(() => scrollToId('contact'), 120)
  }

  return (
    <section className="work section" id="work" ref={root} aria-labelledby="work-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">05</span>
            Selected experiences
          </span>
          <span className="section-top-note">Concept work / 2026</span>
        </div>

        <header className="work-head">
          <h2 className="work-title" id="work-title">
            <span className="line"><span className="line-inner">Creative thinking.</span></span>
            <span className="line"><span className="line-inner"><em>Strategic</em> execution.</span></span>
          </h2>
          <div className="work-head-aside">
            <p>
              A selection of self-initiated concept studies exploring how strategy, identity and
              experience can move together.
            </p>
            <span className="work-disclaimer">Demonstration concepts — not client case studies.</span>
          </div>
        </header>

        <div className="work-grid">
          {PROJECTS.map((project, index) => (
            <div className={`work-item work-item-${index + 1}`} key={project.id}>
              <ProjectCard project={project} onOpen={setSelected} />
            </div>
          ))}
        </div>

        <div className="work-foot">
          <p>
            Have a comparable challenge?
            <span> We&rsquo;d like to hear the context behind it.</span>
          </p>
          <button type="button" className="link-arrow" onClick={goToContact}>
            Start a conversation
            <ArrowUpRight />
          </button>
        </div>
      </div>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected ? `${selected.title} concept details` : 'Concept details'}
        className="dialog-project"
      >
        {selected && (
          <div className="project-dialog-inner">
            <div className="project-dialog-art">
              <ProjectArt variant={selected.art} />
            </div>
            <div className="project-dialog-copy">
              <span className="eyebrow">{selected.category}</span>
              <h3>{selected.title}</h3>
              <p className="project-dialog-meta">
                {selected.industry} <span aria-hidden="true">/</span> {selected.note}
              </p>
              <p>{selected.description}</p>
              <p className="project-dialog-concept">{selected.concept}</p>
              <div className="project-dialog-actions">
                <button type="button" className="btn btn-primary" onClick={goToContact} data-cursor="cta">
                  <span>Start a project like this</span>
                  <span className="btn-arrow"><ArrowUpRight /></span>
                </button>
                <span className="project-dialog-index">{selected.index} / 04</span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  )
}
