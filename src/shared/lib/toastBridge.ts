export type ToastTone = 'success' | 'error' | 'warning' | 'info'

type ToastPusher = (payload: { tone: ToastTone; message: string }) => void

let pushImpl: ToastPusher = () => {}

/** FSD-разрыв: features/widgets вызывают toast без импорта app/store. */
export function setToastPusher(pusher: ToastPusher) {
  pushImpl = pusher
}

export function notifyToast(payload: { tone: ToastTone; message: string }) {
  pushImpl(payload)
}
