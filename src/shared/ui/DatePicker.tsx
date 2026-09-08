import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { LOCALE_TO_INTL } from '@/shared/config/i18n'
import type { AppLocale } from '@/shared/config/appSettings'
import {
  addUtcDays,
  cn,
  parseIsoDate,
  toIsoDate,
} from '@/shared/lib'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

function startOfUtcMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function addUtcMonths(date: Date, months: number) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1),
  )
}

/** Понедельник = 0 … воскресенье = 6 (UTC). */
function mondayBasedWeekday(date: Date) {
  return (date.getUTCDay() + 6) % 7
}

function buildMonthGrid(month: Date) {
  const first = startOfUtcMonth(month)
  const startOffset = mondayBasedWeekday(first)
  const gridStart = addUtcDays(first, -startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = addUtcDays(gridStart, index)
    return {
      iso: toIsoDate(date),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === month.getUTCMonth(),
    }
  })
}

/** Кастомный календарь: popover, клик снаружи, Escape, без native date input. */
export function DatePicker({
  value,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  className,
}: DatePickerProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reactId = useId()
  const panelId = `${reactId}-calendar`

  const intlLocale =
    LOCALE_TO_INTL[i18n.language as AppLocale] ?? LOCALE_TO_INTL.en

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    [intlLocale],
  )

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    [intlLocale],
  )

  const weekdays = [
    t('datepicker.weekday.mo'),
    t('datepicker.weekday.tu'),
    t('datepicker.weekday.we'),
    t('datepicker.weekday.th'),
    t('datepicker.weekday.fr'),
    t('datepicker.weekday.sa'),
    t('datepicker.weekday.su'),
  ]

  const selected = value ? parseIsoDate(value) : null
  const todayIso = toIsoDate(new Date())

  const [viewMonth, setViewMonth] = useState(() =>
    startOfUtcMonth(selected ?? new Date()),
  )

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])

  function openCalendar() {
    setViewMonth(startOfUtcMonth(selected ?? new Date()))
    setOpen(true)
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
    const frame = requestAnimationFrame(() => panelRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  function commit(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openCalendar()
    }
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setViewMonth((current) => addUtcMonths(current, -1))
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setViewMonth((current) => addUtcMonths(current, 1))
    }
  }

  const display = selected
    ? dayFormatter.format(selected)
    : t('datepicker.placeholder')

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      {label ? (
        <p className="mb-1 text-small text-text-secondary">{label}</p>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? label ?? t('datepicker.calendarAria')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (disabled) return
          if (open) {
            setOpen(false)
            return
          }
          openCalendar()
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
          {display}
        </span>
        <CalendarIcon className="size-4 shrink-0 text-text-secondary" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={ariaLabel ?? label ?? t('datepicker.calendarAria')}
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
          className="absolute top-full left-0 z-40 mt-1 w-[17.5rem] rounded-md border border-border bg-surface p-3 shadow-overlay outline-none"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-small hover:border-accent"
              aria-label={t('datepicker.prevMonth')}
              onClick={() =>
                setViewMonth((current) => addUtcMonths(current, -1))
              }
            >
              ‹
            </button>
            <p className="text-small font-medium">
              {monthFormatter.format(viewMonth)}
            </p>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-small hover:border-accent"
              aria-label={t('datepicker.nextMonth')}
              onClick={() =>
                setViewMonth((current) => addUtcMonths(current, 1))
              }
            >
              ›
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1" aria-hidden>
            {weekdays.map((day) => (
              <span
                key={day}
                className="text-center text-caption text-text-secondary"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1" role="grid">
            {cells.map((cell) => {
              const isSelected = cell.iso === value
              const isToday = cell.iso === todayIso

              return (
                <button
                  key={cell.iso}
                  type="button"
                  aria-label={cell.iso}
                  aria-pressed={isSelected}
                  onClick={() => commit(cell.iso)}
                  className={cn(
                    'inline-flex h-8 items-center justify-center rounded-md text-caption transition',
                    isSelected
                      ? 'bg-accent text-white'
                      : cn(
                          cell.inMonth
                            ? 'text-text-primary'
                            : 'text-text-secondary/50',
                          isToday && 'ring-1 ring-accent/40',
                          'hover:bg-surface-muted',
                        ),
                  )}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="h-8 rounded-md border border-border px-2.5 text-caption hover:border-accent"
              onClick={() => commit(todayIso)}
            >
              {t('datepicker.today')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </svg>
  )
}
