import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import {
  dismissToast,
  type ToastItem,
  type ToastTone,
} from '@/app/store/notificationsSlice'
import { cn } from '@/shared/lib'

const AUTO_DISMISS_MS = 6000
const FADE_MS = 280

const toneClass: Record<ToastTone, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-accent/30 bg-accent/10 text-accent',
}

function ToastCard({ item }: { item: ToastItem }) {
  const dispatch = useDispatch<AppDispatch>()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const enter = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(enter)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLeaving(true)
    }, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(() => {
      dispatch(dismissToast(item.id))
    }, FADE_MS)
    return () => window.clearTimeout(timer)
  }, [dispatch, item.id, leaving])

  function close() {
    setLeaving(true)
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-md border px-3 py-2 shadow-overlay transition-[opacity,transform] ease-out',
        toneClass[item.tone],
        visible && !leaving
          ? 'translate-y-0 opacity-100'
          : 'translate-y-1 opacity-0',
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      role="status"
    >
      <p className="min-w-0 flex-1 text-small">{item.message}</p>
      <button
        type="button"
        className="text-caption font-medium opacity-70 hover:opacity-100"
        aria-label="Закрыть уведомление"
        onClick={close}
      >
        ×
      </button>
    </div>
  )
}

/** Единый viewport уведомлений (success/error/warning/info). */
export function ToastViewport() {
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
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  )
}
