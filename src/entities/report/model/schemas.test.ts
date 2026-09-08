import { describe, expect, it } from 'vitest'
import { reportsFiltersSchema } from '@/entities/report'

describe('reportsFiltersSchema', () => {
  it('нормализует диапазон и опциональные id', () => {
    const parsed = reportsFiltersSchema.parse({
      from: '2026-09-01',
      to: '2026-08-01',
      categoryId: '  cat-1  ',
      productId: '',
      customerId: 'cust-001',
      paymentStatus: 'paid',
    })
    expect(parsed.from).toBe('2026-08-01')
    expect(parsed.to).toBe('2026-09-01')
    expect(parsed.categoryId).toBe('cat-1')
    expect(parsed.productId).toBeUndefined()
    expect(parsed.customerId).toBe('cust-001')
    expect(parsed.paymentStatus).toBe('paid')
  })

  it('игнорирует невалидный paymentStatus', () => {
    const parsed = reportsFiltersSchema.parse({
      from: '2026-08-01',
      to: '2026-09-01',
      paymentStatus: 'nope',
    })
    expect(parsed.paymentStatus).toBeUndefined()
  })
})
