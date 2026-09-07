import { describe, expect, it } from 'vitest'
import { applyStockAdjustment, resolveStockStatus } from './stock'

describe('inventory stock', () => {
  it('классифицирует stock status', () => {
    expect(resolveStockStatus(0)).toBe('out_of_stock')
    expect(resolveStockStatus(5, 10)).toBe('low_stock')
    expect(resolveStockStatus(11, 10)).toBe('in_stock')
  })

  it('не уводит available ниже 0', () => {
    expect(applyStockAdjustment(4, -10)).toBe(0)
    expect(applyStockAdjustment(4, 3)).toBe(7)
  })
})
