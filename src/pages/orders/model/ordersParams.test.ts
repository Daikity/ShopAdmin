import { describe, expect, it } from 'vitest'
import { orderFiltersSchema } from '@/entities/order'

describe('orderFiltersSchema', () => {
  it('нормализует page/limit и отбрасывает пустой search', () => {
    const result = orderFiltersSchema.parse({
      page: '2',
      limit: '10',
      search: '  ',
      status: 'pending',
    })

    expect(result.page).toBe(2)
    expect(result.limit).toBe(10)
    expect(result.search).toBeUndefined()
    expect(result.status).toBe('pending')
  })

  it('игнорирует невалидный status через catch', () => {
    const result = orderFiltersSchema.parse({
      page: 1,
      limit: 20,
      status: 'nope',
    })

    expect(result.status).toBeUndefined()
  })
})
