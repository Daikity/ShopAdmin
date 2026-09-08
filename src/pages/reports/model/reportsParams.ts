import {
  reportsFiltersSchema,
  type ReportsFilters,
} from '@/entities/report'
import { rangeForPeriod } from '@/shared/lib'

const defaultRange = rangeForPeriod('30d')

export const reportsFilterDefaults: ReportsFilters = {
  from: defaultRange.from,
  to: defaultRange.to,
  categoryId: undefined,
  productId: undefined,
  customerId: undefined,
  paymentStatus: undefined,
}

export { reportsFiltersSchema }
