import { StoreProvider } from './providers'
import { AppRouter } from './router'

export function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  )
}
