import { configureStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  AUTH_TOKEN_KEY,
  FORCE_401_TOKEN,
  isAuthenticated,
  login,
  logout,
  setupAuthBridge,
} from '@/features/auth'
import { authApi } from '../authApi'
import { baseApi } from '../baseApi'
import { handlers } from './handlers'

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  logout()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})

describe('MSW auth probe', () => {
  it('возвращает 401 без Authorization', async () => {
    const response = await fetch('/api/auth/probe')
    expect(response.status).toBe(401)
  })

  it('возвращает 200 с валидным Bearer', async () => {
    const response = await fetch('/api/auth/probe', {
      headers: { Authorization: 'Bearer demo-token' },
    })
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
  })

  it('возвращает 401 для force-401', async () => {
    const response = await fetch('/api/auth/probe', {
      headers: { Authorization: `Bearer ${FORCE_401_TOKEN}` },
    })
    expect(response.status).toBe(401)
  })
})

describe('baseApi 401 handling', () => {
  beforeEach(() => {
    setupAuthBridge()
    localStorage.clear()
  })

  it('очищает сессию на 401 без navigate', async () => {
    login()
    expect(isAuthenticated()).toBe(true)

    localStorage.setItem(AUTH_TOKEN_KEY, FORCE_401_TOKEN)

    const store = configureStore({
      reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    })

    const result = await store.dispatch(
      authApi.endpoints.authProbe.initiate(undefined, { forceRefetch: true }),
    )

    expect('error' in result && result.error).toBeTruthy()
    expect(isAuthenticated()).toBe(false)
  })
})
