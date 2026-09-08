import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Минимальный confirm dialog: focus trap, Escape, restore focus. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [open, onCancel])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel()
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <h2 id={titleId} className="text-h2">
          {title}
        </h2>
        <div id={descriptionId} className="mt-2 text-small text-text-secondary">
          {description}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel ?? t('confirm.cancel')}
          </button>
          <button
            type="button"
            className={[
              'rounded-md px-3 py-2 text-small font-semibold text-accent-foreground disabled:opacity-60',
              tone === 'danger' ? 'bg-danger' : 'bg-accent hover:bg-accent-hover',
            ].join(' ')}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t('confirm.pending')
              : (confirmLabel ?? t('confirm.confirm'))}
          </button>
        </div>
      </div>
    </div>
  )
}
