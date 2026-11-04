import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SERVICES, type Service } from '../data/content'
import { ArrowUpRight, SERVICE_GLYPHS } from './Icons'
import { ServicePreviewArtwork } from './ServicePreview'

type Props = {
  onSelectService: (service: string) => void
}

function ServiceRow({
  service,
  active,
  onHover,
  onSelect,
}: {
  service: Service
  active: boolean
  onHover: () => void
  onSelect: (service: string) => void
}) {
  return (
    <button
      type="button"
      className={`service-row ${active ? 'is-hovered' : ''}`}
      onClick={() => onSelect(service.shortTitle)}
      onMouseEnter={onHover}
      onFocus={onHover}
      aria-label={`${service.title}. Start a conversation about this service.`}
    >
      <span className="service-number" aria-hidden="true">{service.index}</span>

      <span className="service-content">
        <span className="service-title">{service.title}</span>
        <span className="service-description">{service.description}</span>
      </span>

      <span className="service-caps-wrap">
        <span className="service-caps-label">Capabilities</span>
        <ul className="service-caps">
          {service.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </span>

      <span className="service-glyph" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.15">
          {SERVICE_GLYPHS[service.glyph]}
        </svg>
      </span>

      <span className="service-arrow" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </button>
  )
}

export function Services({ onSelectService }: Props) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [activeService, setActiveService] = useState<Service>(SERVICES[0])

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      gsap.from('.services-title .line-inner', {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-head', start: 'top 80%' },
      })
      gsap.from('.services-intro', {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.services-head', start: 'top 72%' },
      })
      gsap.from('.service-row', {
        opacity: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.services-list', start: 'top 86%' },
      })
    }, root)
    return () => context.revert()
  }, [reduced])

  return (
    <section className="services section" id="services" ref={root} aria-labelledby="services-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">03</span>
            What we bring to the table
          </span>
          <span className="section-top-note">Services / 01—06</span>
        </div>

        <header className="services-head">
          <h2 className="services-title" id="services-title">
            <span className="line"><span className="line-inner">Everything your brand</span></span>
            <span className="line"><span className="line-inner">needs to move <em>forward.</em></span></span>
          </h2>
          <div className="services-head-right">
            <p className="services-intro">
              From the first impression to the final conversion, we connect every part of your digital
              presence into a purposeful growth strategy.
            </p>
            {/* Visual interactive preview anchor */}
            <div className="service-ambient-preview" aria-hidden="true">
              <span className="service-preview-tag">Capability Model / {activeService.index}</span>
              <ServicePreviewArtwork glyph={activeService.glyph} active={true} />
            </div>
          </div>
        </header>

        <div className="services-list" onMouseLeave={() => setActiveService(SERVICES[0])}>
          {SERVICES.map((service) => (
            <ServiceRow
              key={service.index}
              service={service}
              active={activeService.index === service.index}
              onHover={() => setActiveService(service)}
              onSelect={onSelectService}
            />
          ))}
        </div>

        <div className="services-foot">
          <p>
            Not sure where to begin? <span>That&rsquo;s usually the best place to start.</span>
          </p>
          <button type="button" className="link-arrow" onClick={() => onSelectService('Not sure yet')}>
            Talk it through
            <ArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  )
}
