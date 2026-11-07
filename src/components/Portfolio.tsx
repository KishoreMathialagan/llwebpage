import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { PROJECTS, type Project } from '../data/content'
import { getPublishedCMSProjects, type CMSProject } from '../lib/cmsStorage'
import { ArrowUpRight } from './Icons'
import { ProjectArt } from './ProjectArt'
import { Dialog } from './Dialog'
import { scrollToId } from '../lib/scroll'

type DisplayProject = CMSProject | Project

function ProjectCard({
  project,
  onOpen,
}: {
  project: DisplayProject
  onOpen: (project: DisplayProject) => void
}) {
  const hasCoverImage = 'coverImage' in project && Boolean(project.coverImage)

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
          {hasCoverImage ? (
            <img
              src={(project as CMSProject).coverImage}
              alt={(project as CMSProject).imageAlt || project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ProjectArt variant={project.art} />
          )}
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

  const [projectList, setProjectList] = useState<DisplayProject[]>(() => {
    const published = getPublishedCMSProjects()
    return published.length ? published : PROJECTS
  })

  const [selected, setSelected] = useState<DisplayProject | null>(null)

  // Reactive listener for CMS updates
  useEffect(() => {
    const handleCMSChange = () => {
      const published = getPublishedCMSProjects()
      const nextList = published.length ? published : PROJECTS
      setProjectList(nextList)
    }

    window.addEventListener('leadloom-cms-change', handleCMSChange)
    return () => window.removeEventListener('leadloom-cms-change', handleCMSChange)
  }, [])

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
  }, [reduced, projectList])

  const goToContact = () => {
    setSelected(null)
    window.setTimeout(() => scrollToId('contact'), 120)
  }

  const currentIndex = selected ? projectList.findIndex((p) => p.id === selected.id) : -1
  const prevProject = currentIndex > 0 ? projectList[currentIndex - 1] : projectList[projectList.length - 1]
  const nextProject = currentIndex < projectList.length - 1 ? projectList[currentIndex + 1] : projectList[0]

  const hasSelectedCover = selected && 'coverImage' in selected && Boolean(selected.coverImage)
  const selectedCms = selected as CMSProject | null

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
          {projectList.map((project, index) => (
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
        category={selected ? `${selected.category} / Concept Study` : 'Concept details'}
        className="drawer-project"
        footer={
          selected && (
            <>
              <div className="drawer-nav">
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => setSelected(prevProject)}
                  aria-label="Previous concept"
                  title="Previous concept"
                >
                  ←
                </button>
                <span className="drawer-index-indicator">{selected.index} / 0{projectList.length}</span>
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => setSelected(nextProject)}
                  aria-label="Next concept"
                  title="Next concept"
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
                <span>Start a project like this</span>
                <span className="btn-arrow"><ArrowUpRight /></span>
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="project-drawer-body">
            <div className="project-drawer-art">
              {hasSelectedCover ? (
                <img
                  src={(selected as CMSProject).coverImage}
                  alt={(selected as CMSProject).imageAlt || selected.title}
                  className="w-full h-auto max-h-[360px] object-cover rounded-md"
                />
              ) : (
                <ProjectArt variant={selected.art} />
              )}
            </div>
            <div className="project-drawer-info">
              <div className="project-drawer-meta-row">
                <span className="eyebrow">{selected.category}</span>
                <span className="project-drawer-meta-divider">•</span>
                <span className="project-drawer-industry">{selected.industry}</span>
              </div>
              <h3 className="project-drawer-title">{selected.title}</h3>
              <p className="project-drawer-note">{selected.note}</p>
              <div className="project-drawer-desc-block">
                <p className="project-drawer-desc">{selected.description}</p>
              </div>

              {selected.concept && (
                <div className="project-drawer-concept">
                  <span className="eyebrow">Strategic Concept Focus</span>
                  <p>{selected.concept}</p>
                </div>
              )}

              {selectedCms?.challenge && (
                <div className="project-drawer-concept mt-4">
                  <span className="eyebrow">The Challenge</span>
                  <p>{selectedCms.challenge}</p>
                </div>
              )}

              {selectedCms?.outcome && (
                <div className="project-drawer-concept mt-4">
                  <span className="eyebrow">Outcome & Impact</span>
                  <p className="text-[#D7F56B]">{selectedCms.outcome}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </section>
  )
}
