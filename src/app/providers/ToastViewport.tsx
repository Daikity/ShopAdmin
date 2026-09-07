import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import { dismissToast, type ToastTone } from '@/app/store/notificationsSlice'

const toneClass: Record<ToastTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-accent/30 bg-accent/10 text-accent',
}

/** Единый viewport уведомлений (success/error/warning/info). */
export function ToastViewport() {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => state.notifications.items)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-md border px-3 py-2 shadow-overlay ${toneClass[item.tone]}`}
          role="status"
        >
          <p className="min-w-0 flex-1 text-small">{item.message}</p>
          <button
            type="button"
            className="text-caption font-medium opacity-70 hover:opacity-100"
            aria-label="Закрыть уведомление"
            onClick={() => dispatch(dismissToast(item.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
