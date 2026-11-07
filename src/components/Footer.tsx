import { NAV_ITEMS, SITE } from '../data/content'
import { ArrowUpRight } from './Icons'
import { scrollToId } from '../lib/scroll'

const BRAND_ITEMS = Array.from({ length: 8 }, (_, i) => i)

export function Footer() {
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

        {/* Infinite Scrolling Marquee */}
        <div className="footer-brand" aria-hidden="true">
          <div className="footer-marquee">
            <div className="footer-marquee-track">
              <div className="footer-marquee-group">
                {BRAND_ITEMS.map((_, i) => (
                  <span className="footer-marquee-item" key={`a-${i}`}>
                    <span className="footer-brand-text">ANTARA</span>
                    <span className="footer-marquee-star" aria-hidden="true">*</span>
                  </span>
                ))}
              </div>
              <div className="footer-marquee-group" aria-hidden="true">
                {BRAND_ITEMS.map((_, i) => (
                  <span className="footer-marquee-item" key={`b-${i}`}>
                    <span className="footer-brand-text">ANTARA</span>
                    <span className="footer-marquee-star" aria-hidden="true">*</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ANTARA. All rights reserved.</span>
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
