import { returnFiltersSchema, type ReturnFilters } from '@/entities/return'

export const returnsFilterDefaults: ReturnFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  status: undefined,
  sort: 'createdAt:desc',
}

export { returnFiltersSchema }
