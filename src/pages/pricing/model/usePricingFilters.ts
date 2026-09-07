import { pricingFiltersSchema, type PricingFilters } from '@/entities/pricing'
import { useUrlFilters } from '@/shared/lib'
import { pricingFilterDefaults } from './pricingParams'

export function usePricingFilters() {
  return useUrlFilters<PricingFilters>({
    schema: pricingFiltersSchema,
    defaults: pricingFilterDefaults,
  })
}
