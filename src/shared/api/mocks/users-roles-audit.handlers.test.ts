import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { login, logout, setupAuthBridge } from '@/features/auth'
import { handlers } from './handlers'
import { resetAuditStore } from './audit.store'
import { seedAuditLog } from './data/users.seed'

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
  seedAuditLog()
})

afterAll(() => {
  server.close()
})

describe('MSW users/roles/audit', () => {
  it('users требует auth и отдаёт список', async () => {
    const denied = await fetch('/api/users')
    expect(denied.status).toBe(401)

    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/users?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.items.length).toBeGreaterThan(0)
    expect(body.total).toBeGreaterThanOrEqual(5)
  })

  it('roles отдаёт матрицу permissions', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/roles', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await response.json()
    expect(body).toHaveLength(5)
    expect(body[0].permissions.length).toBeGreaterThan(0)
  })

  it('audit-log фильтрует по entity', async () => {
    login()
    const token = localStorage.getItem('shopadmin_auth_token')
    const response = await fetch('/api/audit-log?entity=inventory&limit=20', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await response.json()
    expect(body.items.length).toBeGreaterThan(0)
    expect(
      body.items.every((item: { entity: string }) => item.entity === 'inventory'),
    ).toBe(true)
  })
})
