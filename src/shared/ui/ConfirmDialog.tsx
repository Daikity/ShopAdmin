import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'

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

/** Минимальный confirm dialog для destructive / irreversible действий. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  tone = 'default',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    cancelRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-overlay">
        <h2 id={titleId} className="text-h2">
          {title}
        </h2>
        <div className="mt-2 text-small text-text-secondary">{description}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            className="rounded-md border border-border px-3 py-2 text-small"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
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
            {isPending ? 'Выполняется…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
