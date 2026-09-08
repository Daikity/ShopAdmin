import { setupAuthBridge } from '@/features/auth'
import '@/shared/config/i18n'
import { StoreProvider, ToastViewport } from './providers'
import { AppRouter } from './router'

setupAuthBridge()

export function App() {
  return (
    <StoreProvider>
      <AppRouter />
      <ToastViewport />
    </StoreProvider>
  )
}
