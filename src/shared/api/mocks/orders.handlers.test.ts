import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { handlers } from './handlers'
import { ordersDb } from './data/orders.seed'
import { changeOrderStatus, shouldForceOrderConflict } from './orders.logic'

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

describe('MSW orders', () => {
  it('seed содержит ≥150 orders', () => {
    expect(ordersDb.orders.length).toBeGreaterThanOrEqual(150)
  })

  it('list orders требует auth и поддерживает pagination', async () => {
    const denied = await fetch('/api/orders')
    expect(denied.status).toBe(401)

    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/orders?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.items).toHaveLength(10)
    expect(body.total).toBeGreaterThanOrEqual(150)
  })

  it('фильтрует по status', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/orders?status=pending&limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await response.json()
    expect(
      body.items.every((item: { status: string }) => item.status === 'pending'),
    ).toBe(true)
  })

  it('меняет статус и блокирует недопустимый переход', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const pending = ordersDb.orders.find(
      (order) => order.status === 'pending' && !shouldForceOrderConflict(order.id),
    )
    expect(pending).toBeTruthy()

    const ok = await fetch(`/api/orders/${pending!.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'confirmed' }),
    })
    expect(ok.status).toBe(200)

    const bad = await fetch(`/api/orders/${pending!.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'delivered' }),
    })
    expect(bad.status).toBe(400)
  })

  it('возвращает 409 для демо conflict id', () => {
    const conflict = ordersDb.orders.find(
      (order) =>
        shouldForceOrderConflict(order.id) && order.status === 'pending',
    )
    expect(conflict).toBeTruthy()

    const result = changeOrderStatus(conflict!.id, 'confirmed')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(409)
    }
  })
})
