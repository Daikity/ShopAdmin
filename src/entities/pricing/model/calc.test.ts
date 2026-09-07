import { describe, expect, it } from 'vitest'
import {
  applyPriceAdjustment,
  buildBulkPricePreview,
  calcDiscount,
  calcMargin,
} from './calc'

describe('pricing calc', () => {
  it('считает margin и discount', () => {
    expect(calcMargin(100, 60)).toBe(40)
    expect(calcDiscount(80, 100)).toBe(20)
    expect(calcDiscount(100, null)).toBe(0)
  })

  it('строит bulk preview', () => {
    const preview = buildBulkPricePreview(
      [
        { id: '1', productName: 'A', sku: 'A1', price: 100 },
        { id: '2', productName: 'B', sku: 'B1', price: 50 },
      ],
      'percent',
      10,
    )

    expect(preview.newTotal).toBe(165)
    expect(preview.oldTotal).toBe(150)
    expect(applyPriceAdjustment(100, 'fixed', -7)).toBe(93)
  })
})
