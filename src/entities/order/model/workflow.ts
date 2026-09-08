import type { OrderStatus } from './types'

/** Явные переходы статусов заказа — не размазывать по JSX. */
const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

export type OrderAction =
  | 'confirm'
  | 'cancel'
  | 'start_fulfillment'
  | 'ship'
  | 'deliver'
  | 'refund'

const ACTION_TO_STATUS: Record<OrderAction, OrderStatus> = {
  confirm: 'confirmed',
  cancel: 'cancelled',
  start_fulfillment: 'processing',
  ship: 'shipped',
  deliver: 'delivered',
  refund: 'refunded',
}

export function canChangeOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): boolean {
  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus)
}

export function getAllowedNextStatuses(
  currentStatus: OrderStatus,
): readonly OrderStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus]
}

export function resolveOrderActionStatus(action: OrderAction): OrderStatus {
  return ACTION_TO_STATUS[action]
}

export function canPerformOrderAction(
  currentStatus: OrderStatus,
  action: OrderAction,
): boolean {
  return canChangeOrderStatus(currentStatus, resolveOrderActionStatus(action))
}

export function getAvailableOrderActions(
  currentStatus: OrderStatus,
): OrderAction[] {
  return (Object.keys(ACTION_TO_STATUS) as OrderAction[]).filter((action) =>
    canPerformOrderAction(currentStatus, action),
  )
}

export function isDestructiveOrderAction(action: OrderAction): boolean {
  return action === 'cancel' || action === 'refund'
}

/** Синхронизация payment/fulfillment при смене статуса. */
export function deriveStatusesFromOrderStatus(status: OrderStatus): {
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled' | 'returned'
} {
  switch (status) {
    case 'pending':
      return { paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled' }
    case 'confirmed':
      return { paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled' }
    case 'processing':
      return { paymentStatus: 'paid', fulfillmentStatus: 'partial' }
    case 'shipped':
    case 'delivered':
      return { paymentStatus: 'paid', fulfillmentStatus: 'fulfilled' }
    case 'cancelled':
      return { paymentStatus: 'failed', fulfillmentStatus: 'unfulfilled' }
    case 'refunded':
      return { paymentStatus: 'refunded', fulfillmentStatus: 'returned' }
  }
}
