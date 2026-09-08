import type { OrderListItem, OrderStatus } from '@/entities/order'

export type DashboardPeriod = 'today' | '7d' | '30d' | '90d' | 'custom'

export type DashboardParams = {
  from?: string
  to?: string
}

export type DashboardKpis = {
  revenue: number
  orders: number
  aov: number
  conversion: number
  refunds: number
  lowStock: number
}

export type DashboardStatusPoint = {
  status: OrderStatus
  label: string
  count: number
}

export type DashboardRevenuePoint = {
  date: string
  revenue: number
}

export type DashboardTopProduct = {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export type DashboardData = {
  kpis: DashboardKpis
  ordersByStatus: DashboardStatusPoint[]
  revenueOverTime: DashboardRevenuePoint[]
  topProducts: DashboardTopProduct[]
  recentOrders: OrderListItem[]
}
