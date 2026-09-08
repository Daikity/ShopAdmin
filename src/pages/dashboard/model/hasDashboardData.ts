import type { DashboardData } from '@/entities/dashboard'

export function hasDashboardData(data: DashboardData) {
  return (
    data.kpis.orders > 0 ||
    data.kpis.revenue > 0 ||
    data.kpis.lowStock > 0 ||
    data.recentOrders.length > 0
  )
}
