import type {
  ReturnItem,
  ReturnListItem,
  ReturnsListParams,
  ReturnsListResponse,
  ReturnStatus,
} from '@/entities/return'
import { canChangeReturnStatus } from '@/entities/return'
import { appendAudit } from './audit.store'
import { customersReturnsDb } from './data/customers-returns.seed'

export function listReturns(params: ReturnsListParams): ReturnsListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered: ReturnListItem[] = [...customersReturnsDb.returns]

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.number.toLowerCase().includes(search) ||
        item.orderNumber.toLowerCase().includes(search) ||
        item.customerName.toLowerCase().includes(search) ||
        item.productName.toLowerCase().includes(search),
    )
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const [sortField, sortOrder] = (params.sort ?? 'createdAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof ReturnItem]
    const right = b[sortField as keyof ReturnItem]
    if (typeof left === 'number' && typeof right === 'number') {
      return sortOrder === 'asc' ? left - right : right - left
    }
    return sortOrder === 'asc'
      ? String(left ?? '').localeCompare(String(right ?? ''))
      : String(right ?? '').localeCompare(String(left ?? ''))
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.limit

  return {
    items: filtered.slice(start, start + params.limit),
    total,
    page,
    limit: params.limit,
    totalPages,
  }
}

export function getReturn(id: string): ReturnItem | null {
  return customersReturnsDb.returns.find((item) => item.id === id) ?? null
}

export type ChangeReturnResult =
  | { ok: true; item: ReturnItem }
  | { ok: false; status: 400 | 404; message: string }

export function changeReturnStatus(
  id: string,
  nextStatus: ReturnStatus,
): ChangeReturnResult {
  const item = customersReturnsDb.returns.find((row) => row.id === id)
  if (!item) {
    return { ok: false, status: 404, message: 'Not found' }
  }

  if (!canChangeReturnStatus(item.status, nextStatus)) {
    return {
      ok: false,
      status: 400,
      message: `Cannot change return from ${item.status} to ${nextStatus}`,
    }
  }

  const previous = item.status
  item.status = nextStatus
  item.updatedAt = new Date().toISOString()

  appendAudit({
    user: 'Shop Admin',
    action: 'return.status',
    entity: 'return',
    entityId: item.id,
    changes: `${item.number}: ${previous} → ${nextStatus}`,
  })

  const details = customersReturnsDb.customerDetails.get(item.customerId)
  if (details) {
    const summary = details.returns.find((row) => row.id === item.id)
    if (summary) summary.status = nextStatus
    details.activity.unshift({
      id: `${item.customerId}-ret-status-${Date.now()}`,
      at: item.updatedAt,
      type: 'return',
      message: `Return ${item.number} → ${nextStatus}`,
    })
  }

  return { ok: true, item: structuredClone(item) }
}
