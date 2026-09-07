import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { productsDb } from './data/products.seed'
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

describe('MSW products bulk', () => {
  it('возвращает partial success при смешанном результате', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')

    // Берём ids включая кратные 7 (force fail) и обычные
    const ids = productsDb.products.slice(0, 21).map((item) => item.id)

    const response = await fetch('/api/products/bulk', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
        action: { type: 'changeStatus', status: 'active' },
      }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.updated).toBeGreaterThan(0)
    expect(body.failed).toBeGreaterThan(0)
    expect(body.updated + body.failed).toBe(ids.length)
    expect(body.failures.length).toBe(body.failed)
  })

  it('export возвращает csv без изменения каталога', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const before = productsDb.products.length
    const ids = productsDb.products.slice(0, 3).map((item) => item.id)

    const response = await fetch('/api/products/bulk', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
        action: { type: 'export' },
      }),
    })

    const body = await response.json()
    expect(body.exportCsv).toContain('id,name,sku,status,price,stock')
    expect(productsDb.products.length).toBe(before)
  })
})
