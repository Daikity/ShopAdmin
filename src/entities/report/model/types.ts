import type { PaymentStatus } from '@/entities/order'

export type ReportsParams = {
  from?: string
  to?: string
  categoryId?: string
  productId?: string
  customerId?: string
  paymentStatus?: PaymentStatus
}

export type ReportsKpis = {
  revenue: number
  orders: number
  aov: number
  refunds: number
}

export type ReportRevenuePoint = {
  date: string
  revenue: number
}

export type ReportOrdersPoint = {
  date: string
  orders: number
}

export type ReportCategoryItem = {
  categoryId: string
  categoryName: string
  revenue: number
  orders: number
}

export type ReportTopProduct = {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export type ReportCustomerItem = {
  customerId: string
  customerName: string
  orders: number
  revenue: number
}

export type ReportsData = {
  kpis: ReportsKpis
  revenueOverTime: ReportRevenuePoint[]
  ordersOverTime: ReportOrdersPoint[]
  byCategory: ReportCategoryItem[]
  topProducts: ReportTopProduct[]
  byCustomer: ReportCustomerItem[]
}
