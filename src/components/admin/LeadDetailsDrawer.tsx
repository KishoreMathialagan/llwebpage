import { useEffect, useRef, useState, useId } from 'react'
import { createPortal } from 'react-dom'
import type { Lead, LeadStatus } from '../../lib/adminStorage'
import { LEAD_STATUS_BADGES, LEAD_PRIORITY_BADGES } from './adminTheme'
import { stopScroll, startScroll } from '../../lib/scroll'
import { AdminCustomSelect } from './AdminCustomSelect'

interface Props {
  lead: Lead | null
  onClose: () => void
  onUpdateStatus: (id: string, status: LeadStatus) => void
  onUpdateLead: (id: string, changes: Partial<Lead>) => void
  onDeleteLead: (id: string) => void
}

const STAGES: LeadStatus[] = ['New', 'In Review', 'Contacted', 'Proposal Sent', 'Won', 'Lost']

export function LeadDetailsDrawer({
  lead,
  onClose,
  onUpdateStatus,
  onUpdateLead,
  onDeleteLead,
}: Props) {
  const [editingNotes, setEditingNotes] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [renderedLead, setRenderedLead] = useState<Lead | null>(lead)

  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const prevFocusedRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  // Keep internal state updated when lead changes
  useEffect(() => {
    if (lead) {
      setRenderedLead(lead)
      setEditingNotes(lead.notes || '')
      setConfirmDelete(false)
      setSaveStatus('idle')
      // Trigger slide-in animation on next frame
      requestAnimationFrame(() => {
        setIsOpen(true)
      })
    } else {
      setIsOpen(false)
    }
  }, [lead])

  // Reset scroll to top when lead changes
  useEffect(() => {
    if (renderedLead && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [renderedLead?.id])

  // Body scroll locking and focus management
  useEffect(() => {
    if (!lead) return

    prevFocusedRef.current = document.activeElement as HTMLElement | null
    stopScroll()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button for accessibility
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 100)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }

      // Keyboard tab trap
      if (event.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null)

        if (focusable.length > 0) {
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
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      startScroll()
      if (prevFocusedRef.current) {
        prevFocusedRef.current.focus()
      }
    }
  }, [lead])

  // Smooth close with slide-out animation
  const handleClose = () => {
    setIsOpen(false)
    setConfirmDelete(false)
    setTimeout(() => {
      onClose()
    }, 320)
  }

  const handleSaveNotes = () => {
    if (!renderedLead) return
    setSaveStatus('saving')
    onUpdateLead(renderedLead.id, { notes: editingNotes })
    setRenderedLead({ ...renderedLead, notes: editingNotes })
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2200)
    }, 180)
  }

  const handleCopyEmail = async () => {
    if (!renderedLead?.email) return
    try {
      await navigator.clipboard.writeText(renderedLead.email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleDelete = () => {
    if (!renderedLead) return
    onDeleteLead(renderedLead.id)
    handleClose()
  }

  if (!lead && !renderedLead) return null

  const active = renderedLead || lead!

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex justify-end transition-visibility duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Dark backdrop over remaining dashboard */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-opacity duration-300 ease-out cursor-pointer ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Right-Side Slide-in Drawer Panel */}
      <div
        ref={drawerRef}
        data-lenis-prevent="true"
        className={`relative z-10 flex flex-col h-full h-[100dvh] w-full sm:w-[480px] lg:w-[560px] max-w-[90vw] max-sm:max-w-full bg-[#10120F] border-l border-[#292B26] shadow-[-20px_0_60px_rgba(0,0,0,0.8)] transform transition-transform duration-350 ease-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ============================================================ */}
        {/* A. FIXED HEADER (Permanent at top, does not scroll away)      */}
        {/* ============================================================ */}
        <header className="flex-shrink-0 px-6 sm:px-7 py-5 sm:py-6 border-b border-[#292B26] bg-[#10120F]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded uppercase ${
                    LEAD_STATUS_BADGES[active.status] || 'bg-[#151713] text-[#D7F56B] border border-[#292B26]'
                  }`}
                >
                  {active.status}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                    LEAD_PRIORITY_BADGES[active.priority] || 'bg-[#151713] text-[#A3A49A] border border-[#292B26]'
                  }`}
                >
                  {active.priority} Priority
                </span>
                <span className="text-[10px] font-mono text-[#777970] ml-auto sm:ml-0">
                  ID: #{active.id.slice(-6)}
                </span>
              </div>

              {/* Client & Organization Name */}
              <h2
                id={titleId}
                className="text-lg sm:text-xl font-semibold text-[#EAEAE3] tracking-tight truncate"
                title={active.name}
              >
                {active.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-[#A3A49A] flex-wrap">
                <span className="font-medium text-[#EAEAE3]">{active.company || 'Private Organization'}</span>
                <span className="text-[#292B26]">•</span>
                <a
                  href={`mailto:${active.email}`}
                  className="text-[#D7F56B] hover:underline truncate max-w-[220px]"
                  title={`Email ${active.email}`}
                >
                  {active.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-[10px] font-mono text-[#777970] hover:text-[#EAEAE3] transition-colors px-1.5 py-0.5 rounded hover:bg-[#151713] border border-transparent hover:border-[#292B26]"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              className="flex-shrink-0 w-8 h-8 rounded-full border border-[#292B26] bg-[#151713] text-[#A3A49A] hover:text-[#EAEAE3] hover:border-[#D7F56B]/40 hover:bg-[#1a1c17] transition-all flex items-center justify-center text-sm"
              title="Close Drawer (Esc)"
              aria-label="Close Drawer"
            >
              ✕
            </button>
          </div>
        </header>

        {/* ============================================================ */}
        {/* B. SCROLLABLE CONTENT (Middle region scrolls independently)   */}
        {/* ============================================================ */}
        <div
          ref={contentRef}
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-7 py-6 space-y-6 [scrollbar-width:thin] [scrollbar-color:#292B26_transparent]"
        >
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#151713] rounded-lg border border-[#292B26]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#777970] block">
                Estimated Deal Value
              </span>
              <div className="text-xl font-mono font-medium text-[#D7F56B] mt-1 tabular-nums">
                ${active.estimatedValue.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 bg-[#151713] rounded-lg border border-[#292B26]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#777970] block">
                Interested Service
              </span>
              <div className="text-sm font-medium text-[#EAEAE3] mt-1 truncate" title={active.service}>
                {active.service}
              </div>
            </div>
          </div>

          {/* Submission Timestamp & Metadata */}
          <div className="px-3.5 py-2.5 bg-[#151713]/60 rounded-md border border-[#292B26] flex items-center justify-between text-xs font-mono text-[#777970]">
            <span>Captured via Website</span>
            <span className="text-[#A3A49A]">
              {new Date(active.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Client Inbound Brief */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#777970]">
                Client Inbound Brief
              </label>
              <span className="text-[10px] font-mono text-[#777970]">
                {active.details.length} chars
              </span>
            </div>
            <div className="p-4 bg-[#151713] rounded-lg border border-[#292B26] text-xs text-[#EAEAE3] leading-relaxed whitespace-pre-wrap break-words">
              {active.details || <span className="text-[#777970] italic">No inbound brief provided.</span>}
            </div>
          </div>

          {/* Internal Strategy Notes Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="lead-strategy-notes" className="text-xs font-mono uppercase tracking-wider text-[#777970]">
                Internal Strategy Notes
              </label>
              <div className="flex items-center gap-2">
                {saveStatus === 'saved' && (
                  <span className="text-[11px] font-mono text-[#D7F56B] animate-fadeIn">
                    Saved ✓
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={saveStatus === 'saving'}
                  className="px-2.5 py-1 text-xs font-mono bg-[#151713] hover:bg-[#D7F56B] text-[#D7F56B] hover:text-[#090A09] border border-[#292B26] hover:border-[#D7F56B] rounded transition-colors disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>

            <textarea
              id="lead-strategy-notes"
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                  e.preventDefault()
                  handleSaveNotes()
                }
              }}
              placeholder="Add private team notes, qualification takeaways, pricing objections, next scheduled touchpoint, or deal context (Ctrl+S to save)..."
              rows={5}
              className="w-full bg-[#151713] border border-[#292B26] rounded-lg p-3.5 text-xs text-[#EAEAE3] focus:outline-none focus:border-[#D7F56B]/60 placeholder-[#777970] leading-relaxed resize-y min-h-[110px]"
            />
            <p className="text-[10px] font-mono text-[#777970]">
              Notes are stored privately within the CRM and are not visible to the client.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* C. FIXED FOOTER (Permanent at bottom, does not scroll away)   */}
        {/* ============================================================ */}
        <footer className="flex-shrink-0 px-6 sm:px-7 py-4 border-t border-[#292B26] bg-[#10120F] pb-[max(1rem,env(safe-area-inset-bottom))]">
          {!confirmDelete ? (
            <div className="flex items-center justify-between gap-4">
              {/* Update Stage Control */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#A3A49A] whitespace-nowrap">Stage:</span>
                <AdminCustomSelect
                  value={active.status}
                  onChange={(val) => {
                    const next = val as LeadStatus
                    onUpdateStatus(active.id, next)
                    setRenderedLead({ ...active, status: next })
                  }}
                  variant="compact"
                  options={STAGES.map((s) => ({
                    label: s,
                    value: s,
                    badgeClass: LEAD_STATUS_BADGES[s],
                  }))}
                  ariaLabel="Update Lead Stage"
                />
              </div>

              {/* Delete Lead Button */}
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 text-xs text-[#777970] hover:text-[#EAEAE3] hover:bg-[#151713] border border-transparent hover:border-[#292B26] rounded transition-colors"
              >
                Delete Lead
              </button>
            </div>
          ) : (
            /* Inline Confirmation Prompt */
            <div className="flex items-center justify-between gap-3 bg-[#151713] border border-[#292B26] p-2.5 rounded-lg">
              <span className="text-xs text-[#EAEAE3]">Permanently delete this inquiry?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 text-xs text-[#A3A49A] hover:text-[#EAEAE3] rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1 text-xs font-semibold bg-[#292B26] hover:bg-[#383a34] text-[#EAEAE3] hover:text-[#ffffff] rounded border border-[#3d4038] transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>,
    document.body
  )
}

