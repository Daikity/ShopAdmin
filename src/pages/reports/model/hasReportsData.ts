import type { ReportsData } from '@/entities/report'

export function hasReportsData(data: ReportsData) {
  return (
    data.kpis.orders > 0 ||
    data.kpis.revenue > 0 ||
    data.revenueOverTime.length > 0 ||
    data.byCategory.length > 0
  )
}
