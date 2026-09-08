import { cn } from '@/shared/lib'

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  className?: string
}

/** Кастомный checkbox в стиле Admin Kit (без native look). */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-start gap-3 rounded-md border border-border p-3 text-left text-small transition outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'hover:border-accent/50',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded border transition',
          checked
            ? 'border-accent bg-accent text-white'
            : 'border-border bg-surface',
        )}
      >
        {checked ? (
          <svg
            viewBox="0 0 16 16"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="font-medium text-text-primary">{label}</span>
        {description ? (
          <span className="mt-1 block text-text-secondary">{description}</span>
        ) : null}
      </span>
    </button>
  )
}
