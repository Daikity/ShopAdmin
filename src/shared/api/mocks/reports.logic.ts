import type {
  ReportCategoryItem,
  ReportCustomerItem,
  ReportOrdersPoint,
  ReportRevenuePoint,
  ReportTopProduct,
  ReportsData,
  ReportsParams,
} from '@/entities/report'
import type { OrderDetails } from '@/entities/order'
import { customersReturnsDb } from './data/customers-returns.seed'
import { categories, productsDb } from './data/products.seed'
import { ordersDb } from './data/orders.seed'

function toDateKey(iso: string) {
  return iso.slice(0, 10)
}

function inRange(iso: string, from?: string, to?: string) {
  const key = toDateKey(iso)
  if (from && key < from) return false
  if (to && key > to) return false
  return true
}

function isRevenueOrder(order: OrderDetails) {
  return order.paymentStatus === 'paid' || order.status === 'delivered'
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function productCategoryId(productId: string) {
  return productsDb.products.find((product) => product.id === productId)
    ?.categoryId
}

function categoryName(categoryId: string) {
  return categories.find((item) => item.id === categoryId)?.name ?? 'Unknown'
}

export function filterOrdersForReports(params: ReportsParams): OrderDetails[] {
  return ordersDb.orders.filter((order) => {
    if (!inRange(order.createdAt, params.from, params.to)) return false
    if (params.customerId && order.customerId !== params.customerId) return false
    if (params.paymentStatus && order.paymentStatus !== params.paymentStatus) {
      return false
    }
    if (params.productId) {
      const hasProduct = order.items.some(
        (item) => item.productId === params.productId,
      )
      if (!hasProduct) return false
    }
    if (params.categoryId) {
      const hasCategory = order.items.some((item) => {
        const categoryId = productCategoryId(item.productId)
        return categoryId === params.categoryId
      })
      if (!hasCategory) return false
    }
    return true
  })
}

function buildRevenueSeries(orders: OrderDetails[]): ReportRevenuePoint[] {
  const buckets = new Map<string, number>()
  for (const order of orders) {
    if (!isRevenueOrder(order)) continue
    const key = toDateKey(order.createdAt)
    buckets.set(key, (buckets.get(key) ?? 0) + order.total)
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue: roundMoney(revenue) }))
}

function buildOrdersSeries(orders: OrderDetails[]): ReportOrdersPoint[] {
  const buckets = new Map<string, number>()
  for (const order of orders) {
    const key = toDateKey(order.createdAt)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, orders: count }))
}

function buildByCategory(orders: OrderDetails[]): ReportCategoryItem[] {
  const map = new Map<
    string,
    { revenue: number; orderIds: Set<string> }
  >()

  for (const order of orders) {
    if (order.status === 'cancelled') continue
    for (const item of order.items) {
      const categoryId = productCategoryId(item.productId) ?? 'unknown'
      const current = map.get(categoryId) ?? {
        revenue: 0,
        orderIds: new Set<string>(),
      }
      current.revenue += item.total
      current.orderIds.add(order.id)
      map.set(categoryId, current)
    }
  }

  return [...map.entries()]
    .map(([categoryId, stats]) => ({
      categoryId,
      categoryName: categoryName(categoryId),
      revenue: roundMoney(stats.revenue),
      orders: stats.orderIds.size,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

function buildTopProducts(orders: OrderDetails[]): ReportTopProduct[] {
  const map = new Map<
    string,
    { productName: string; quantity: number; revenue: number }
  >()

  for (const order of orders) {
    if (order.status === 'cancelled') continue
    for (const item of order.items) {
      const current = map.get(item.productId) ?? {
        productName: item.productName,
        quantity: 0,
        revenue: 0,
      }
      current.quantity += item.quantity
      current.revenue += item.total
      map.set(item.productId, current)
    }
  }

  return [...map.entries()]
    .map(([productId, stats]) => ({
      productId,
      productName: stats.productName,
      quantity: stats.quantity,
      revenue: roundMoney(stats.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

function buildByCustomer(orders: OrderDetails[]): ReportCustomerItem[] {
  const map = new Map<
    string,
    { customerName: string; orders: number; revenue: number }
  >()

  for (const order of orders) {
    if (order.status === 'cancelled') continue
    const current = map.get(order.customerId) ?? {
      customerName: order.customerName,
      orders: 0,
      revenue: 0,
    }
    current.orders += 1
    if (isRevenueOrder(order)) {
      current.revenue += order.total
    }
    map.set(order.customerId, current)
  }

  return [...map.entries()]
    .map(([customerId, stats]) => ({
      customerId,
      customerName: stats.customerName,
      orders: stats.orders,
      revenue: roundMoney(stats.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

export function buildReportsData(params: ReportsParams): ReportsData {
  const filtered = filterOrdersForReports(params)
  const revenueOrders = filtered.filter(isRevenueOrder)
  const revenue = roundMoney(
    revenueOrders.reduce((sum, order) => sum + order.total, 0),
  )
  const ordersCount = filtered.length
  const aov =
    revenueOrders.length > 0
      ? roundMoney(revenue / revenueOrders.length)
      : 0

  const refunds = roundMoney(
    customersReturnsDb.returns
      .filter((item) => {
        if (item.status !== 'refunded') return false
        if (!inRange(item.createdAt, params.from, params.to)) return false
        if (params.customerId && item.customerId !== params.customerId) {
          return false
        }
        if (params.productId && item.productId !== params.productId) {
          return false
        }
        if (params.categoryId) {
          const categoryId = productCategoryId(item.productId)
          if (categoryId !== params.categoryId) return false
        }
        return true
      })
      .reduce((sum, item) => sum + item.amount, 0),
  )

  return {
    kpis: {
      revenue,
      orders: ordersCount,
      aov,
      refunds,
    },
    revenueOverTime: buildRevenueSeries(filtered),
    ordersOverTime: buildOrdersSeries(filtered),
    byCategory: buildByCategory(filtered),
    topProducts: buildTopProducts(filtered),
    byCustomer: buildByCustomer(filtered),
  }
}
