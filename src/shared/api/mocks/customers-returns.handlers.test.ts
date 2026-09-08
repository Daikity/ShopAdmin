import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { listAuditEntries, resetAuditStore } from './audit.store'
import { customersReturnsDb } from './data/customers-returns.seed'
import { handlers } from './handlers'
import { changeReturnStatus } from './returns.logic'

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

describe('MSW customers + returns', () => {
  it('seed содержит ≥80 customers и ≥60 returns', () => {
    expect(customersReturnsDb.customers.length).toBeGreaterThanOrEqual(80)
    expect(customersReturnsDb.returns.length).toBeGreaterThanOrEqual(60)
  })

  it('list customers и details', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const list = await fetch('/api/customers?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(list.status).toBe(200)
    const body = await list.json()
    expect(body.items).toHaveLength(10)

    const id = body.items[0].id as string
    const details = await fetch(`/api/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(details.status).toBe(200)
    const customer = await details.json()
    expect(customer.id).toBe(id)
    expect(Array.isArray(customer.orders)).toBe(true)
  })

  it('return workflow и audit', async () => {
    const requested = customersReturnsDb.returns.find(
      (item) => item.status === 'requested',
    )
    expect(requested).toBeTruthy()

    const approved = changeReturnStatus(requested!.id, 'approved')
    expect(approved.ok).toBe(true)

    const bad = changeReturnStatus(requested!.id, 'refunded')
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.status).toBe(400)

    expect(listAuditEntries()[0]?.action).toBe('return.status')
  })
})
