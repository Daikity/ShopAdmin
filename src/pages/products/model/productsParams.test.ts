import { describe, expect, it } from 'vitest'
import { productFiltersSchema } from '@/entities/product'

describe('productFiltersSchema', () => {
  it('нормализует валидные URL-значения', () => {
    const result = productFiltersSchema.parse({
      page: '2',
      limit: '20',
      search: '  iphone  ',
      status: 'active',
      categoryId: 'cat-1',
      sort: 'price:desc',
    })

    expect(result).toEqual({
      page: 2,
      limit: 20,
      search: 'iphone',
      status: 'active',
      categoryId: 'cat-1',
      sort: 'price:desc',
    })
  })

  it('отбрасывает невалидный status и sort через catch', () => {
    const result = productFiltersSchema.parse({
      page: '0',
      status: 'nope',
      sort: 'hack',
    })

    expect(result.page).toBe(1)
    expect(result.status).toBeUndefined()
    expect(result.sort).toBeUndefined()
  })
})
