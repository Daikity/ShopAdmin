import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export type ToastItem = {
  id: string
  tone: ToastTone
  message: string
}

type NotificationsState = {
  items: ToastItem[]
}

const initialState: NotificationsState = {
  items: [],
}

let toastSeq = 0

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushToast: (
      state,
      action: PayloadAction<{ tone: ToastTone; message: string }>,
    ) => {
      toastSeq += 1
      state.items.push({
        id: `toast-${toastSeq}`,
        tone: action.payload.tone,
        message: action.payload.message,
      })
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { pushToast, dismissToast } = notificationsSlice.actions
export const notificationsReducer = notificationsSlice.reducer
