import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

/** Кастомный listbox-select: keyboard + Escape + click outside. */
export function Select({
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className,
}: SelectProps) {
  const { t } = useTranslation()
  const resolvedPlaceholder = placeholder ?? t('common.select')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const reactId = useId()
  const listboxId = `${reactId}-listbox`

  const selected = options.find((option) => option.value === value)
  const displayLabel = selected?.label ?? resolvedPlaceholder

  function openList() {
    const index = options.findIndex((option) => option.value === value)
    setActiveIndex(index >= 0 ? index : 0)
    setOpen(true)
  }

  function commit(next: string) {
    onChange(next)
    setOpen(false)
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => listRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openList()
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % options.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(
        (current) => (current - 1 + options.length) % options.length,
      )
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) commit(option.value)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return
          if (open) {
            setOpen(false)
            return
          }
          openList()
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-left text-small outline-none transition focus-visible:border-accent',
          open && 'border-accent ring-2 ring-accent/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          className={cn(
            'truncate',
            selected ? 'text-text-primary' : 'text-text-secondary',
          )}
        >
          {displayLabel}
        </span>
        <span
          aria-hidden
          className={cn(
            'text-text-secondary transition-transform',
            open && 'rotate-180',
          )}
        >
          ▾
        </span>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            options[activeIndex]
              ? `${reactId}-option-${options[activeIndex].value || 'empty'}`
              : undefined
          }
          onKeyDown={onListKeyDown}
          className="absolute top-full right-0 left-0 z-30 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-surface py-1 shadow-overlay outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex

            return (
              <li
                key={option.value || `empty-${index}`}
                id={`${reactId}-option-${option.value || 'empty'}`}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'cursor-pointer px-3 py-2 text-small text-text-primary',
                  isActive && 'bg-surface-muted',
                  isSelected && 'font-medium text-accent',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  // Не даём label/trigger перехватить клик и снова открыть список
                  event.preventDefault()
                }}
                onClick={() => commit(option.value)}
              >
                {option.label}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
