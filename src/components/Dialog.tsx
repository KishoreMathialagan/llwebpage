import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './Icons'
import { startScroll, stopScroll } from '../lib/scroll'

type Props = {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onClose, label, children, className = '' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

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
    <div className={`dialog ${open ? 'is-open' : ''} ${className}`} aria-hidden={!open}>
      <button
        type="button"
        className="dialog-backdrop"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className="dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <span id={titleId} className="sr-only">{label}</span>
        <button className="dialog-close" type="button" onClick={onClose} ref={closeRef} aria-label="Close dialog">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
