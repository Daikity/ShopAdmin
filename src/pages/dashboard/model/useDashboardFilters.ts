import { dashboardFiltersSchema, type DashboardFilters } from '@/entities/dashboard'
import { useUrlFilters } from '@/shared/lib'
import { dashboardFilterDefaults } from './dashboardParams'

export function useDashboardFilters() {
  return useUrlFilters<DashboardFilters>({
    schema: dashboardFiltersSchema,
    defaults: dashboardFilterDefaults,
  })
}
