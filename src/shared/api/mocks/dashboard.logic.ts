import type {
  DashboardData,
  DashboardParams,
  DashboardRevenuePoint,
  DashboardStatusPoint,
  DashboardTopProduct,
} from '@/entities/dashboard'
import type { OrderDetails, OrderStatus } from '@/entities/order'
import { customersReturnsDb } from './data/customers-returns.seed'
import { inventoryPricingDb } from './data/inventory-pricing.seed'
import { ordersDb } from './data/orders.seed'

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

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

function buildRevenueSeries(
  orders: OrderDetails[],
): DashboardRevenuePoint[] {
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

function buildOrdersByStatus(orders: OrderDetails[]): DashboardStatusPoint[] {
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderStatus, number>

  for (const order of orders) {
    counts[order.status] += 1
  }

  return ORDER_STATUSES.map((status) => ({
    status,
    label: status,
    count: counts[status],
  }))
}

function buildTopProducts(orders: OrderDetails[]): DashboardTopProduct[] {
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
    .slice(0, 8)
}

export function buildDashboardData(params: DashboardParams): DashboardData {
  const orders = ordersDb.orders.filter((order) =>
    inRange(order.createdAt, params.from, params.to),
  )
  const revenueOrders = orders.filter(isRevenueOrder)
  const revenue = roundMoney(
    revenueOrders.reduce((sum, order) => sum + order.total, 0),
  )
  const ordersCount = orders.length
  const aov =
    revenueOrders.length > 0
      ? roundMoney(revenue / revenueOrders.length)
      : 0
  const paidCount = orders.filter(
    (order) => order.paymentStatus === 'paid' || order.paymentStatus === 'refunded',
  ).length
  const conversion =
    ordersCount === 0
      ? 0
      : Math.round((paidCount / ordersCount) * 1000) / 10

  const refunds = roundMoney(
    customersReturnsDb.returns
      .filter(
        (item) =>
          item.status === 'refunded' &&
          inRange(item.createdAt, params.from, params.to),
      )
      .reduce((sum, item) => sum + item.amount, 0),
  )

  const lowStock = inventoryPricingDb.inventory.filter(
    (item) => item.available <= item.lowStockThreshold,
  ).length

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8)
    .map((order) => ({
      id: order.id,
      number: order.number,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemsCount: order.itemsCount,
      total: order.total,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      status: order.status,
      currency: order.currency,
    }))

  return {
    kpis: {
      revenue,
      orders: ordersCount,
      aov,
      conversion,
      refunds,
      lowStock,
    },
    ordersByStatus: buildOrdersByStatus(orders),
    revenueOverTime: buildRevenueSeries(orders),
    topProducts: buildTopProducts(orders),
    recentOrders,
  }
}
