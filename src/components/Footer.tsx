import { useRef, useEffect } from 'react'
import { NAV_ITEMS, SITE } from '../data/content'
import { ArrowUpRight } from './Icons'
import { scrollToId } from '../lib/scroll'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Footer() {
  const brandRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !brandRef.current) return
    const el = brandRef.current

    const onPointerMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 0)`
    }

    const onPointerLeave = () => {
      el.style.transform = 'translate3d(0, 0, 0)'
    }

    el.addEventListener('mousemove', onPointerMove, { passive: true })
    el.addEventListener('mouseleave', onPointerLeave)

    return () => {
      el.removeEventListener('mousemove', onPointerMove)
      el.removeEventListener('mouseleave', onPointerLeave)
    }
  }, [reduced])

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-lead">
            <span className="eyebrow">Next step</span>
            <button type="button" className="footer-cta" onClick={() => scrollToId('contact')} data-cursor="cta">
              <span>Have a project in mind?</span>
              <em>Let&rsquo;s talk.</em>
              <span className="footer-cta-arrow" aria-hidden="true"><ArrowUpRight /></span>
            </button>
            <p className="footer-statement">{SITE.shortStatement}</p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <span className="footer-col-title">Navigate</span>
              <nav aria-label="Footer">
                {NAV_ITEMS.map((item) => (
                  <a key={item.id} href={item.href}>{item.label}</a>
                ))}
              </nav>
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Connect</span>
              {SITE.socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer noopener">
                  {social.label}
                  <ArrowUpRight className="footer-external" />
                </a>
              ))}
            </div>

            <div className="footer-col footer-col-contact">
              <span className="footer-col-title">Contact</span>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <span>{SITE.location}</span>
            </div>
          </div>
        </div>

        <div className="footer-brand" ref={brandRef} aria-hidden="true">
          <span className="footer-brand-text">LeadLoom</span>
          <svg className="footer-brand-mark" viewBox="0 0 120 80" fill="none">
            <ellipse cx="60" cy="40" rx="56" ry="22" transform="rotate(-24 60 40)" stroke="rgba(214,243,106,.65)" strokeWidth="1.2" />
            <ellipse cx="60" cy="40" rx="56" ry="22" transform="rotate(34 60 40)" stroke="rgba(243,241,233,.26)" />
            <circle cx="106" cy="17" r="4.5" fill="#D6F36A" />
          </svg>
        </div>

        <div className="footer-bottom">
          <span>© 2026 LeadLoom. All rights reserved.</span>
          <span className="footer-philosophy">Growth is not accidental. It&rsquo;s engineered.</span>
          <button type="button" className="footer-top-link" onClick={() => scrollToId('top')}>
            Back to top
            <svg viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path d="M6 13V1M1 6L6 1L11 6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
