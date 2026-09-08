import { describe, expect, it } from 'vitest'
import { customerFiltersSchema } from './schemas'

describe('customerFiltersSchema', () => {
  it('нормализует page и пустой search', () => {
    const result = customerFiltersSchema.parse({
      page: '3',
      limit: '10',
      search: '  ',
      status: 'active',
    })
    expect(result.page).toBe(3)
    expect(result.search).toBeUndefined()
    expect(result.status).toBe('active')
  })
})
