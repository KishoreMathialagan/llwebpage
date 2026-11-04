import { useEffect, useRef } from 'react'
import { NAV_ITEMS, SITE } from '../data/content'
import { ArrowUpRight } from './Icons'
import { scrollToId, startScroll, stopScroll } from '../lib/scroll'

type Props = {
  open: boolean
  onClose: () => void
  activeId: string
}

export function MobileMenu({ open, onClose, activeId }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    stopScroll()
    document.body.classList.add('menu-locked')
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 380)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.site-nav a, .site-nav button, #mobile-menu a, #mobile-menu button',
        ),
      ).filter((element) => element.offsetParent !== null && !element.hasAttribute('disabled'))
      if (!focusable.length) return

      const current = document.activeElement as HTMLElement
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('menu-locked')
      startScroll()
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    onClose()
    window.setTimeout(() => scrollToId(id), 90)
  }

  return (
    <div
      id="mobile-menu"
      className={`mobile-menu ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
    >
      <div className="mobile-menu-panel" ref={panelRef}>
        <div className="mobile-menu-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="mobile-menu-head">
          <span className="eyebrow">Menu</span>
          <span className="mobile-menu-note">Strategy / Creativity / Digital</span>
        </div>

        <nav className="mobile-menu-links" aria-label="Mobile primary">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              className={`mobile-menu-link ${activeId === item.id ? 'is-active' : ''}`}
              style={{ transitionDelay: open ? `${140 + index * 45}ms` : '0ms' }}
              onClick={(event) => goTo(event, item.id)}
            >
              <span className="mobile-menu-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="mobile-menu-label">{item.label}</span>
              <ArrowUpRight className="mobile-menu-arrow" />
            </a>
          ))}
        </nav>

        <div className="mobile-menu-foot">
          <div className="mobile-menu-contact">
            <span className="eyebrow">Start a conversation</span>
            <a href={`mailto:${SITE.email}`} onClick={() => onClose()}>
              {SITE.email}
            </a>
            <span className="mobile-menu-location">{SITE.location}</span>
          </div>
          <div className="mobile-menu-socials">
            {SITE.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer noopener">
                {social.label}
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
