import { reportsFiltersSchema, type ReportsFilters } from '@/entities/report'
import { useUrlFilters } from '@/shared/lib'
import { reportsFilterDefaults } from './reportsParams'

export function useReportsFilters() {
  return useUrlFilters<ReportsFilters>({
    schema: reportsFiltersSchema,
    defaults: reportsFilterDefaults,
  })
}
