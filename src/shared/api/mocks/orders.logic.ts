import type {
  Order,
  OrderDetails,
  OrderListItem,
  OrdersListParams,
  OrdersListResponse,
  OrderStatus,
} from '@/entities/order'
import {
  canChangeOrderStatus,
  deriveStatusesFromOrderStatus,
} from '@/entities/order'
import { ordersDb } from './data/orders.seed'

function toListItem(order: OrderDetails): OrderListItem {
  return {
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
  }
}

/** Демо rollback: заказы с номером, кратным 11, падают с 409. */
export function shouldForceOrderConflict(orderId: string) {
  const match = orderId.match(/(\d+)$/)
  if (!match) return false
  const num = Number(match[1])
  return Number.isFinite(num) && num % 11 === 0
}

export function listOrders(params: OrdersListParams): OrdersListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered = [...ordersDb.orders]

  if (search) {
    filtered = filtered.filter(
      (order) =>
        order.number.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        order.id.toLowerCase().includes(search),
    )
  }

  if (params.status) {
    filtered = filtered.filter((order) => order.status === params.status)
  }

  if (params.paymentStatus) {
    filtered = filtered.filter(
      (order) => order.paymentStatus === params.paymentStatus,
    )
  }

  if (params.fulfillmentStatus) {
    filtered = filtered.filter(
      (order) => order.fulfillmentStatus === params.fulfillmentStatus,
    )
  }

  const [sortField, sortOrder] = (params.sort ?? 'createdAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof Order]
    const right = b[sortField as keyof Order]
    if (typeof left === 'number' && typeof right === 'number') {
      return sortOrder === 'asc' ? left - right : right - left
    }
    const leftText = String(left ?? '')
    const rightText = String(right ?? '')
    return sortOrder === 'asc'
      ? leftText.localeCompare(rightText)
      : rightText.localeCompare(leftText)
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.limit
  const items = filtered.slice(start, start + params.limit).map(toListItem)

  return { items, total, page, limit: params.limit, totalPages }
}

export function getOrderDetails(id: string): OrderDetails | null {
  return ordersDb.orders.find((order) => order.id === id) ?? null
}

export type ChangeOrderStatusResult =
  | { ok: true; order: OrderDetails }
  | { ok: false; status: 400 | 404 | 409; message: string }

export function changeOrderStatus(
  id: string,
  nextStatus: OrderStatus,
): ChangeOrderStatusResult {
  const order = ordersDb.orders.find((item) => item.id === id)
  if (!order) {
    return { ok: false, status: 404, message: 'Not found' }
  }

  if (!canChangeOrderStatus(order.status, nextStatus)) {
    return {
      ok: false,
      status: 400,
      message: `Cannot change status from ${order.status} to ${nextStatus}`,
    }
  }

  if (shouldForceOrderConflict(id)) {
    return {
      ok: false,
      status: 409,
      message: 'Conflict: fulfillment locked',
    }
  }

  const derived = deriveStatusesFromOrderStatus(nextStatus)
  const now = new Date().toISOString()

  order.status = nextStatus
  order.paymentStatus = derived.paymentStatus
  order.fulfillmentStatus = derived.fulfillmentStatus
  order.updatedAt = now
  order.timeline = [
    ...order.timeline,
    {
      id: `${order.id}-tl-${order.timeline.length + 1}`,
      at: now,
      type: 'status',
      message: `Status changed to ${nextStatus}`,
    },
  ]

  return { ok: true, order: structuredClone(order) }
}
