import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './Icons'
import { startScroll, stopScroll } from '../lib/scroll'

type Props = {
  open: boolean
  onClose: () => void
  label: string
  category?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Dialog({
  open,
  onClose,
  label,
  category,
  children,
  footer,
  className = '',
}: Props) {
  const panelRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  // Reset scroll to top when opening or switching items
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [open, label])

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    stopScroll()
    document.body.classList.add('dialog-locked')
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('dialog-locked')
      startScroll()
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={`drawer dialog ${open ? 'is-open' : ''} ${className}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="drawer-backdrop dialog-backdrop"
        aria-label="Close drawer"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        className="drawer-panel dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={titleId}
        ref={panelRef}
        data-lenis-prevent="true"
      >
        <span id={titleId} className="sr-only">{label}</span>

        {/* Region A: Fixed Header */}
        <header className="drawer-header" data-lenis-prevent="true">
          <div className="drawer-header-meta">
            <span className="drawer-eyebrow">{category || label}</span>
          </div>
          <button
            className="drawer-close dialog-close"
            type="button"
            onClick={onClose}
            ref={closeRef}
            aria-label="Close drawer"
          >
            <CloseIcon />
          </button>
        </header>

        {/* Region B: Independently Scrollable Content Body */}
        <div
          className="drawer-content"
          ref={contentRef}
          data-lenis-prevent="true"
          onWheel={(e) => {
            // Stop bubbling to window/Lenis to ensure native scroll works purely inside drawer
            e.stopPropagation()
          }}
          onTouchMove={(e) => {
            e.stopPropagation()
          }}
        >
          {children}
        </div>

        {/* Region C: Fixed Bottom Action Footer */}
        {footer && (
          <footer className="drawer-footer" data-lenis-prevent="true">
            {footer}
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  )
}

export { Dialog as Drawer }
