import {
  useState,
  useRef,
  useEffect,
  useId,
  type KeyboardEvent,
} from 'react'

export type CustomSelectOption = {
  label: string
  value: string
  isPlaceholder?: boolean
}

export type CustomSelectProps = {
  id?: string
  name: string
  value: string
  placeholder?: string
  options: (string | CustomSelectOption)[]
  onChange: (value: string) => void
  onBlur?: () => void
  error?: boolean
  describedBy?: string
  required?: boolean
  disabled?: boolean
}

export function CustomSelect({
  id: customId,
  name,
  value,
  placeholder = 'Select a service',
  options: rawOptions,
  onChange,
  onBlur,
  error = false,
  describedBy,
  required = false,
  disabled = false,
}: CustomSelectProps) {
  const generatedId = useId()
  const id = customId || generatedId
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  // Normalize options into { label, value, isPlaceholder }
  const normalizedOptions: CustomSelectOption[] = rawOptions.map((opt) => {
    if (typeof opt === 'string') {
      const isPlaceholder = opt === placeholder || opt.toLowerCase() === 'select a service'
      return {
        label: opt,
        value: isPlaceholder ? '' : opt,
        isPlaceholder,
      }
    }
    return opt
  })

  // Close dropdown on click outside
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false)
          onBlur?.()
        }
      }
    }
    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerDown)
    }
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen, onBlur])

  // Sync highlighted index when dropdown opens or value changes
  useEffect(() => {
    if (isOpen) {
      const idx = normalizedOptions.findIndex((opt) => opt.value === value)
      setHighlightedIndex(idx >= 0 ? idx : 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, value])

  // Auto-scroll the active option into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      })
    }
  }, [isOpen, highlightedIndex])

  const handleSelect = (option: CustomSelectOption) => {
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
        setHighlightedIndex((prev) =>
          prev < normalizedOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : normalizedOptions.length - 1
        )
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
        e.preventDefault()
        setIsOpen(false)
        onBlur?.()
        triggerRef.current?.focus()
        break
      case 'Tab':
        setIsOpen(false)
        onBlur?.()
        break
    }
  }

  const currentOption = normalizedOptions.find((opt) => opt.value === value && opt.value !== '')
  const selectedText = currentOption ? currentOption.label : placeholder
  const isPlaceholderActive = !currentOption

  return (
    <div
      ref={containerRef}
      className={`custom-select-wrap ${isOpen ? 'is-open' : ''} ${error ? 'has-error' : ''}`}
    >
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-menu`}
        aria-invalid={error}
        aria-describedby={describedBy}
        disabled={disabled}
        className={`custom-select-trigger ${isPlaceholderActive ? 'is-placeholder' : ''}`}
        onClick={() => {
          if (disabled) return
          if (isOpen) {
            setIsOpen(false)
            onBlur?.()
          } else {
            setIsOpen(true)
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <span className="custom-select-value">{selectedText}</span>
        <svg
          className="custom-select-chevron"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.5 2L6 6.5L10.5 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${id}-menu`}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-opt-${highlightedIndex}` : undefined
          }
          className="custom-select-menu"
        >
          {normalizedOptions.map((option, idx) => {
            const isSelected = option.value === value
            const isHighlighted = idx === highlightedIndex
            return (
              <li
                key={`${option.label}-${idx}`}
                ref={(el) => (optionRefs.current[idx] = el)}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${
                  option.isPlaceholder ? 'is-placeholder-option' : ''
                } ${isSelected ? 'is-selected' : ''} ${
                  isHighlighted ? 'is-highlighted' : ''
                }`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span className="custom-select-option-label">{option.label}</span>
                {isSelected && !option.isPlaceholder && (
                  <span className="custom-select-check" aria-hidden="true">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1.5 5.2L4.3 8L10.5 1.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

