import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { listAuditEntries, resetAuditStore } from './audit.store'
import { inventoryPricingDb } from './data/inventory-pricing.seed'
import { handlers } from './handlers'
import {
  adjustStock,
  shouldForceInventoryConflict,
} from './inventory.logic'

const server = setupServer(...handlers)

beforeAll(() => {
  setupAuthBridge()
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  logout()
  localStorage.clear()
  resetAuditStore()
})

afterAll(() => {
  server.close()
})

describe('MSW inventory', () => {
  it('отдаёт inventory и warehouses', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')

    const warehouses = await fetch('/api/warehouses', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(warehouses.status).toBe(200)
    expect((await warehouses.json()).length).toBeGreaterThanOrEqual(3)

    const list = await fetch('/api/inventory?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(list.status).toBe(200)
    const body = await list.json()
    expect(body.items).toHaveLength(10)
    expect(body.total).toBeGreaterThanOrEqual(100)
  })

  it('adjust пишет audit и conflict откатывается на %13', async () => {
    const okItem = inventoryPricingDb.inventory.find(
      (item) => !shouldForceInventoryConflict(item.id),
    )
    expect(okItem).toBeTruthy()
    const previous = okItem!.available
    const result = adjustStock({
      id: okItem!.id,
      adjustment: -2,
      reason: 'Damaged',
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.item.available).toBe(Math.max(0, previous - 2))
    }
    expect(listAuditEntries()[0]?.action).toBe('inventory.adjust')

    const conflict = inventoryPricingDb.inventory.find((item) =>
      shouldForceInventoryConflict(item.id),
    )
    expect(conflict).toBeTruthy()
    const failed = adjustStock({
      id: conflict!.id,
      adjustment: 1,
      reason: 'Test',
    })
    expect(failed.ok).toBe(false)
    if (!failed.ok) expect(failed.status).toBe(409)
  })
})

describe('MSW pricing', () => {
  it('list и bulk update', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const list = await fetch('/api/pricing?page=1&limit=5', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(list.status).toBe(200)
    const body = await list.json()
    expect(body.items).toHaveLength(5)

    const ids = body.items.map((item: { id: string }) => item.id)
    const bulk = await fetch('/api/pricing/bulk', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids, mode: 'percent', value: 10 }),
    })
    expect(bulk.status).toBe(200)
    const bulkBody = await bulk.json()
    expect(bulkBody.updated).toBe(ids.length)
  })
})
