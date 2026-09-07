import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

async function enableMocking() {
  if (import.meta.env.PROD) {
    return
  }

  const { worker } = await import('@/shared/api/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root не найден')
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
