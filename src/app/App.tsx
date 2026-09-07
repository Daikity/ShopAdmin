import { setupAuthBridge } from '@/features/auth'
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
