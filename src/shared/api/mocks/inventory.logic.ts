import type {
  AdjustStockPayload,
  InventoryItem,
  InventoryListItem,
  InventoryListParams,
  InventoryListResponse,
} from '@/entities/inventory'
import {
  applyStockAdjustment,
  resolveStockStatus,
} from '@/entities/inventory'
import { appendAudit } from './audit.store'
import { inventoryPricingDb, warehouses } from './data/inventory-pricing.seed'

function toListItem(item: InventoryItem): InventoryListItem {
  return {
    ...item,
    stockStatus: resolveStockStatus(item.available, item.lowStockThreshold),
  }
}

/** Демо rollback: inv id с product номером % 13 === 0. */
export function shouldForceInventoryConflict(id: string) {
  const match = id.match(/prod-(\d+)/)
  if (!match) return false
  const num = Number(match[1])
  return Number.isFinite(num) && num % 13 === 0
}

export function listWarehouses() {
  return warehouses
}

export function listInventory(
  params: InventoryListParams,
): InventoryListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered = inventoryPricingDb.inventory.map(toListItem)

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.productName.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search),
    )
  }

  if (params.warehouseId) {
    filtered = filtered.filter((item) => item.warehouseId === params.warehouseId)
  }

  if (params.stockStatus) {
    filtered = filtered.filter((item) => item.stockStatus === params.stockStatus)
  }

  if (params.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === params.categoryId)
  }

  const [sortField, sortOrder] = (params.sort ?? 'updatedAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof InventoryListItem]
    const right = b[sortField as keyof InventoryListItem]
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

export function getInventoryItem(id: string): InventoryListItem | null {
  const item = inventoryPricingDb.inventory.find((row) => row.id === id)
  return item ? toListItem(item) : null
}

export type AdjustStockResult =
  | { ok: true; item: InventoryListItem }
  | { ok: false; status: 400 | 404 | 409; message: string }

export function adjustStock(payload: AdjustStockPayload): AdjustStockResult {
  const item = inventoryPricingDb.inventory.find((row) => row.id === payload.id)
  if (!item) {
    return { ok: false, status: 404, message: 'Not found' }
  }

  if (!Number.isInteger(payload.adjustment) || payload.adjustment === 0) {
    return { ok: false, status: 400, message: 'Invalid adjustment' }
  }

  if (!payload.reason.trim()) {
    return { ok: false, status: 400, message: 'Reason required' }
  }

  if (shouldForceInventoryConflict(payload.id)) {
    return { ok: false, status: 409, message: 'Conflict: stock locked' }
  }

  const previous = item.available
  item.available = applyStockAdjustment(item.available, payload.adjustment)
  item.updatedAt = new Date().toISOString()

  appendAudit({
    user: 'Shop Admin',
    action: 'inventory.adjust',
    entity: 'inventory',
    entityId: item.id,
    changes: `${item.sku}: ${previous} → ${item.available} (${payload.reason})`,
  })

  return { ok: true, item: toListItem(structuredClone(item)) }
}
