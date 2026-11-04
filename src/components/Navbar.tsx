import { useEffect, useRef, useState } from 'react'
import { NAV_ITEMS } from '../data/content'
import { ArrowUpRight, Wordmark } from './Icons'
import { scrollToId } from '../lib/scroll'
import { MobileMenu } from './MobileMenu'

type Props = {
  ready: boolean
}

export function Navbar({ ready }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('top')
  const [menuOpen, setMenuOpen] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.id)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-38% 0px -54% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))

    const onScroll = () => {
      if (raf.current !== null) return
      raf.current = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 28)
        raf.current = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current)
        raf.current = null
      }
    }
  }, [])

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${ready ? 'is-ready' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
        <div className="nav-shell">
          <a
            className="nav-brand"
            href="#top"
            aria-label="LeadLoom — back to top"
            onClick={(event) => goTo(event, 'top')}
          >
            <Wordmark />
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                aria-current={active === item.id ? 'page' : undefined}
                onClick={(event) => goTo(event, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a
              className="nav-cta"
              href="#contact"
              data-cursor="cta"
              onClick={(event) => goTo(event, 'contact')}
            >
              <span className="nav-cta-dot" aria-hidden="true" />
              Let&rsquo;s Talk
              <ArrowUpRight className="nav-cta-arrow" />
            </a>

            <button
              type="button"
              className="nav-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="nav-hairline" aria-hidden="true" />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={active} />
    </>
  )
}
