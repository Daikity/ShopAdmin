import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { handlers } from './handlers'

const server = setupServer(...handlers)

beforeAll(() => {
  setupAuthBridge()
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

describe('MSW dashboard/reports', () => {
  it('dashboard требует auth и отдаёт KPI', async () => {
    const denied = await fetch('/api/dashboard?from=2026-06-01&to=2026-09-07')
    expect(denied.status).toBe(401)

    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch(
      '/api/dashboard?from=2026-06-01&to=2026-09-07',
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.kpis.orders).toBeGreaterThan(0)
    expect(body.revenueOverTime).toBeInstanceOf(Array)
    expect(body.recentOrders).toBeInstanceOf(Array)
  })

  it('reports фильтрует по paymentStatus через URL', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch(
      '/api/reports?from=2026-01-01&to=2026-12-31&paymentStatus=paid',
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.kpis.orders).toBeGreaterThan(0)
    expect(body.byCategory.length).toBeGreaterThan(0)
  })
})
