import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SERVICES, type Service } from '../data/content'
import { getPublishedCMSServices, type CMSService } from '../lib/cmsStorage'
import { ArrowUpRight, SERVICE_GLYPHS } from './Icons'

type Props = {
  onSelectService: (service: string) => void
}

function ServiceRow({
  service,
  active,
  onHover,
  onSelect,
}: {
  service: CMSService | Service
  active: boolean
  onHover: () => void
  onSelect: (service: string) => void
}) {
  return (
    <button
      type="button"
      className={`service-row ${active ? 'is-active is-hovered' : ''}`}
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
          {SERVICE_GLYPHS[service.glyph] || SERVICE_GLYPHS.orbit}
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
  const listRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [serviceList, setServiceList] = useState<(CMSService | Service)[]>(() => {
    const published = getPublishedCMSServices()
    return published.length ? published : SERVICES
  })

  const [activeService, setActiveService] = useState<CMSService | Service>(serviceList[0] || SERVICES[0])
  const scrollActiveIndexRef = useRef(0)

  // Reactive listener for CMS updates
  useEffect(() => {
    const handleCMSChange = () => {
      const published = getPublishedCMSServices()
      const nextList = published.length ? published : SERVICES
      setServiceList(nextList)
      setActiveService(nextList[0] || SERVICES[0])
      ScrollTrigger.refresh()
    }

    window.addEventListener('leadloom-cms-change', handleCMSChange)
    return () => window.removeEventListener('leadloom-cms-change', handleCMSChange)
  }, [])

  useEffect(() => {
    if (!root.current || reduced) return
    const context = gsap.context(() => {
      // 1. Entrance reveals for header
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

      // 2. Natural Scroll-Triggered Sequential Service Activation
      const listEl = listRef.current
      if (!listEl) return
      const rows = Array.from(listEl.querySelectorAll<HTMLElement>('.service-row'))
      if (rows.length === 0) return

      const setServiceActive = (index: number) => {
        if (index < 0 || index >= rows.length) return
        scrollActiveIndexRef.current = index
        rows.forEach((row, i) => {
          if (i === index) {
            row.classList.add('is-active', 'is-hovered')
          } else {
            row.classList.remove('is-active', 'is-hovered')
          }
        })
        const target = serviceList[index]
        if (target) {
          setActiveService((prev) => (prev.index === target.index ? prev : target))
        }
      }

      setServiceActive(0)

      ScrollTrigger.create({
        trigger: listEl,
        start: 'top 75%',
        end: 'bottom 20%',
        onUpdate: () => {
          const activationY = window.innerHeight * 0.65
          const listRect = listEl.getBoundingClientRect()

          if (listRect.top > activationY) {
            if (scrollActiveIndexRef.current !== 0) {
              setServiceActive(0)
            }
            return
          }

          let activeIndex = 0
          for (let i = 0; i < rows.length; i++) {
            const rect = rows[i].getBoundingClientRect()
            if (rect.top <= activationY) {
              activeIndex = i
            } else {
              break
            }
          }

          if (activeIndex !== scrollActiveIndexRef.current) {
            setServiceActive(activeIndex)
          }
        },
        onEnter: () => {
          setServiceActive(0)
        },
        onEnterBack: () => {
          setServiceActive(rows.length - 1)
        },
        invalidateOnRefresh: true,
      })
    }, root)

    return () => context.revert()
  }, [reduced, serviceList])

  return (
    <section className="services section" id="services" ref={root} aria-labelledby="services-title">
      <div className="shell">
        <div className="section-top">
          <span className="label">
            <span className="label-index">03</span>
            What we bring to the table
          </span>
          <span className="section-top-note">Services / 01—0{serviceList.length}</span>
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
          </div>
        </header>

        <div
          className="services-list"
          ref={listRef}
          onMouseLeave={() => {
            const current = serviceList[scrollActiveIndexRef.current]
            if (current) setActiveService(current)
          }}
        >
          {serviceList.map((service) => (
            <ServiceRow
              key={service.index || service.title}
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
