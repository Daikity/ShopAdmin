import {
  dashboardFiltersSchema,
  type DashboardFilters,
} from '@/entities/dashboard'
import { rangeForPeriod } from '@/shared/lib'

const defaultRange = rangeForPeriod('30d')

export const dashboardFilterDefaults: DashboardFilters = {
  from: defaultRange.from,
  to: defaultRange.to,
  period: '30d',
}

export { dashboardFiltersSchema }
