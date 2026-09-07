import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { handlers } from './handlers'
import { productsDb } from './data/products.seed'

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

describe('MSW products', () => {
  it('seed содержит ≥100 products и ≥200 variants', () => {
    expect(productsDb.products.length).toBeGreaterThanOrEqual(100)
    expect(productsDb.variants.length).toBeGreaterThanOrEqual(200)
  })

  it('list products требует auth и поддерживает pagination', async () => {
    const denied = await fetch('/api/products')
    expect(denied.status).toBe(401)

    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/products?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.items).toHaveLength(10)
    expect(body.total).toBeGreaterThanOrEqual(100)
  })

  it('возвращает product details', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const id = productsDb.products[0]!.id
    const response = await fetch(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.id).toBe(id)
    expect(Array.isArray(body.variants)).toBe(true)
  })
})
