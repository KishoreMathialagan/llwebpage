import {
  useState,
  useRef,
  useEffect,
  useId,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'

export type SelectOption = {
  label: string
  value: string
  badgeClass?: string
  disabled?: boolean
}

export type AdminCustomSelectProps = {
  value: string
  onChange: (value: string) => void
  options: (string | SelectOption)[]
  placeholder?: string
  variant?: 'default' | 'compact' | 'badge' | 'full'
  className?: string
  menuClassName?: string
  disabled?: boolean
  id?: string
  name?: string
  ariaLabel?: string
  align?: 'left' | 'right'
}

export function AdminCustomSelect({
  value,
  onChange,
  options: rawOptions,
  placeholder = 'Select an option',
  variant = 'default',
  className = '',
  menuClassName = '',
  disabled = false,
  id: customId,
  name,
  ariaLabel,
  align = 'left',
}: AdminCustomSelectProps) {
  const generatedId = useId()
  const id = customId || generatedId
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [coords, setCoords] = useState<{
    top: number
    left: number
    width: number
    openUpward: boolean
  }>({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
  })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Normalize options into { label, value, badgeClass?, disabled? }
  const normalizedOptions: SelectOption[] = rawOptions.map((opt) => {
    if (typeof opt === 'string') {
      return {
        label: opt,
        value: opt,
      }
    }
    return opt
  })

  // Calculate fixed viewport coordinates for portal menu
  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const estimatedMenuHeight = Math.min(normalizedOptions.length * 36 + 16, 260)
    const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow

    const calculatedTop = openUpward
      ? Math.max(8, rect.top - estimatedMenuHeight - 4)
      : rect.bottom + 4

    let calculatedLeft = rect.left
    const minWidth = Math.max(rect.width, variant === 'badge' ? 140 : variant === 'compact' ? 160 : rect.width)

    if (align === 'right' || calculatedLeft + minWidth > window.innerWidth - 12) {
      calculatedLeft = Math.max(12, rect.right - minWidth)
    }

    setCoords({
      top: calculatedTop,
      left: calculatedLeft,
      width: minWidth,
      openUpward,
    })
  }

  // Update position on open, scroll, or resize
  useEffect(() => {
    if (!isOpen) return
    updatePosition()

    const handleWindowChange = () => {
      if (isOpen) updatePosition()
    }

    window.addEventListener('scroll', handleWindowChange, true)
    window.addEventListener('resize', handleWindowChange)

    return () => {
      window.removeEventListener('scroll', handleWindowChange, true)
      window.removeEventListener('resize', handleWindowChange)
    }
  }, [isOpen, normalizedOptions.length])

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  // Highlight selected or first option on open
  useEffect(() => {
    if (isOpen) {
      const idx = normalizedOptions.findIndex((opt) => opt.value === value)
      setHighlightedIndex(idx >= 0 ? idx : 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, value])

  // Scroll active option into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      })
    }
  }, [isOpen, highlightedIndex])

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return
    onChange(option.value)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          let next = prev < normalizedOptions.length - 1 ? prev + 1 : 0
          while (normalizedOptions[next]?.disabled && next !== prev) {
            next = next < normalizedOptions.length - 1 ? next + 1 : 0
          }
          return next
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          let next = prev > 0 ? prev - 1 : normalizedOptions.length - 1
          while (normalizedOptions[next]?.disabled && next !== prev) {
            next = next > 0 ? next - 1 : normalizedOptions.length - 1
          }
          return next
        })
        break
      case 'Home':
        e.preventDefault()
        setHighlightedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setHighlightedIndex(normalizedOptions.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          handleSelect(normalizedOptions[highlightedIndex])
        }
        break
      case 'Escape':
      case 'Tab':
        e.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        break
    }
  }

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  // Variant-specific styling for the closed trigger
  let triggerClasses = ''
  if (variant === 'badge') {
    // Inline status badge in table rows & stage pills
    triggerClasses = `inline-flex items-center justify-between gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border transition-colors cursor-pointer select-none ${
      selectedOption?.badgeClass || 'bg-[#151713] text-[#D7F56B] border-[#292B26] hover:border-[#55584A]'
    }`
  } else if (variant === 'compact') {
    // Compact table / toolbar filter
    triggerClasses =
      'inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#151713] text-[#EAEAE3] border border-[#292B26] hover:border-[#55584A] focus:border-[#D7F56B] focus:outline-none transition-colors cursor-pointer select-none'
  } else {
    // Default & full width form controls
    triggerClasses = `flex items-center justify-between gap-2 px-3 py-2 rounded-md text-xs sm:text-sm bg-[#151713] text-[#EAEAE3] border border-[#292B26] hover:border-[#55584A] focus:border-[#D7F56B] focus:ring-1 focus:ring-[#D7F56B]/20 focus:outline-none transition-all cursor-pointer select-none ${
      variant === 'full' ? 'w-full' : ''
    }`
  }

  return (
    <div className={`relative inline-block ${variant === 'full' ? 'w-full' : ''} ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-menu`}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
        className={`${triggerClasses} ${isOpen ? 'border-[#D7F56B]' : ''} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="truncate text-left">{displayText}</span>
        <svg
          className={`flex-shrink-0 transition-transform duration-200 ${
            variant === 'badge' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          } text-[#D7F56B] ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.5 2L6 6.5L10.5 2"
            stroke="currentColor"
            strokeWidth={variant === 'badge' ? '2' : '1.75'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Floating Menu in Portal to completely prevent table and modal overflow clipping */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            id={`${id}-menu`}
            role="listbox"
            tabIndex={-1}
            data-lenis-prevent="true"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 120,
            }}
            className={`bg-[#10120F] border border-[#35372F] rounded-md shadow-2xl shadow-black/90 py-1 max-h-60 overflow-y-auto animate-fadeIn [scrollbar-width:thin] [scrollbar-color:#292B26_transparent] ${menuClassName}`}
          >
            {normalizedOptions.map((option, idx) => {
              const isSelected = option.value === value
              const isHighlighted = idx === highlightedIndex

              return (
                <button
                  key={`${option.value}-${idx}`}
                  ref={(el) => (optionRefs.current[idx] = el)}
                  id={`${id}-opt-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 transition-colors cursor-pointer ${
                    variant === 'badge'
                      ? 'text-[11px] font-mono tracking-wide py-1.5'
                      : 'text-xs'
                  } ${
                    option.disabled
                      ? 'text-[#777970] cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-[#D7F56B]/10 text-[#D7F56B] font-medium'
                      : isHighlighted
                      ? 'bg-[#1B1F14] text-[#D7F56B]'
                      : 'text-[#EAEAE3] hover:bg-[#1B1F14] hover:text-[#D7F56B]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#D7F56B]"
                      viewBox="0 0 12 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 5.2L4.3 8L10.5 1.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </div>
  )
}

