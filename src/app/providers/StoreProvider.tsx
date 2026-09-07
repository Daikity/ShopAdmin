import { useEffect, type ReactNode } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { pushToast, store, type AppDispatch } from '@/app/store'
import { setToastPusher } from '@/shared/lib'

type StoreProviderProps = {
  children: ReactNode
}

function ToastBridge() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setToastPusher((payload) => {
      dispatch(pushToast(payload))
    })
  }, [dispatch])

  return null
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      <ToastBridge />
      {children}
    </Provider>
  )
}
