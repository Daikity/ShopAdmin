import { returnFiltersSchema, type ReturnFilters } from '@/entities/return'
import { useUrlFilters } from '@/shared/lib'
import { returnsFilterDefaults } from './returnsParams'

export function useReturnsFilters() {
  return useUrlFilters<ReturnFilters>({
    schema: returnFiltersSchema,
    defaults: returnsFilterDefaults,
  })
}
