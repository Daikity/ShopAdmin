import { describe, expect, it } from 'vitest'
import { can, getRoleDefinition } from './permissions'

describe('can()', () => {
  it('admin имеет все ключевые permissions', () => {
    expect(can('admin', 'products.write')).toBe(true)
    expect(can('admin', 'orders.refund')).toBe(true)
    expect(can('admin', 'users.write')).toBe(true)
    expect(can('admin', 'audit.read')).toBe(true)
  })

  it('warehouse только inventory + read', () => {
    expect(can('warehouse', 'inventory.write')).toBe(true)
    expect(can('warehouse', 'products.read')).toBe(true)
    expect(can('warehouse', 'products.write')).toBe(false)
    expect(can('warehouse', 'orders.refund')).toBe(false)
  })

  it('support — returns/orders/customers', () => {
    expect(can('support', 'returns.write')).toBe(true)
    expect(can('support', 'orders.read')).toBe(true)
    expect(can('support', 'inventory.write')).toBe(false)
  })

  it('analyst — reports без write', () => {
    expect(can('analyst', 'reports.read')).toBe(true)
    expect(can('analyst', 'products.write')).toBe(false)
  })

  it('getRoleDefinition возвращает Admin для admin', () => {
    expect(getRoleDefinition('admin').name).toBe('Admin')
  })
})
