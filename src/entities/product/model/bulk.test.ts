import { describe, expect, it } from 'vitest'
import { resolveBulkStatus, type BulkProductsResult } from '@/entities/product'

describe('resolveBulkStatus', () => {
  it('success когда все обновлены', () => {
    const result: BulkProductsResult = { updated: 10, failed: 0, failures: [] }
    expect(resolveBulkStatus(result)).toBe('success')
  })

  it('partial при смешанном результате', () => {
    const result: BulkProductsResult = {
      updated: 84,
      failed: 3,
      failures: [
        { id: 'a', reason: 'x' },
        { id: 'b', reason: 'y' },
        { id: 'c', reason: 'z' },
      ],
    }
    expect(resolveBulkStatus(result)).toBe('partial')
  })

  it('error когда ничего не обновлено', () => {
    const result: BulkProductsResult = {
      updated: 0,
      failed: 2,
      failures: [
        { id: 'a', reason: 'x' },
        { id: 'b', reason: 'y' },
      ],
    }
    expect(resolveBulkStatus(result)).toBe('error')
  })
})
