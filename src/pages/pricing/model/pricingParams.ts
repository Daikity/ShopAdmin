import { pricingFiltersSchema, type PricingFilters } from '@/entities/pricing'

export const pricingFilterDefaults: PricingFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  categoryId: undefined,
  sort: 'updatedAt:desc',
}

export { pricingFiltersSchema }
