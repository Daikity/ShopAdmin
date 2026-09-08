import {
  customerFiltersSchema,
  type CustomerFilters,
} from '@/entities/customer'

export const customersFilterDefaults: CustomerFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  status: undefined,
  sort: 'createdAt:desc',
}

export { customerFiltersSchema }
