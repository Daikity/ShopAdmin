import type {
  BulkPriceRequest,
  PriceItem,
  PriceListItem,
  PricingListParams,
  PricingListResponse,
  UpdatePricePayload,
} from '@/entities/pricing'
import {
  applyPriceAdjustment,
  calcDiscount,
  calcMargin,
} from '@/entities/pricing'
import { appendAudit } from './audit.store'
import { inventoryPricingDb } from './data/inventory-pricing.seed'

function toListItem(item: PriceItem): PriceListItem {
  return {
    ...item,
    margin: calcMargin(item.price, item.cost),
    discount: calcDiscount(item.price, item.compareAtPrice),
  }
}

export function listPricing(params: PricingListParams): PricingListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered = inventoryPricingDb.pricing.map(toListItem)

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.productName.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search),
    )
  }

  if (params.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === params.categoryId)
  }

  const [sortField, sortOrder] = (params.sort ?? 'updatedAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof PriceListItem]
    const right = b[sortField as keyof PriceListItem]
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

export function getPriceItem(id: string): PriceListItem | null {
  const item = inventoryPricingDb.pricing.find((row) => row.id === id)
  return item ? toListItem(item) : null
}

export type UpdatePriceResult =
  | { ok: true; item: PriceListItem }
  | { ok: false; status: 400 | 404; message: string }

export function updatePrice(payload: UpdatePricePayload): UpdatePriceResult {
  const item = inventoryPricingDb.pricing.find((row) => row.id === payload.id)
  if (!item) {
    return { ok: false, status: 404, message: 'Not found' }
  }

  if (payload.price < 0) {
    return { ok: false, status: 400, message: 'Invalid price' }
  }

  const previous = item.price
  item.price = Math.round(payload.price * 100) / 100
  item.compareAtPrice =
    payload.compareAtPrice === null
      ? null
      : Math.round(payload.compareAtPrice * 100) / 100
  item.updatedAt = new Date().toISOString()

  appendAudit({
    user: 'Shop Admin',
    action: 'pricing.update',
    entity: 'pricing',
    entityId: item.id,
    changes: `${item.sku}: €${previous.toFixed(2)} → €${item.price.toFixed(2)}`,
  })

  return { ok: true, item: toListItem(structuredClone(item)) }
}

export function bulkUpdatePrices(request: BulkPriceRequest): {
  updated: number
  items: PriceListItem[]
} {
  const updatedItems: PriceListItem[] = []

  for (const id of request.ids) {
    const item = inventoryPricingDb.pricing.find((row) => row.id === id)
    if (!item) continue
    const previous = item.price
    item.price = applyPriceAdjustment(item.price, request.mode, request.value)
    item.updatedAt = new Date().toISOString()
    appendAudit({
      user: 'Shop Admin',
      action: 'pricing.bulk',
      entity: 'pricing',
      entityId: item.id,
      changes: `${item.sku}: €${previous.toFixed(2)} → €${item.price.toFixed(2)}`,
    })
    updatedItems.push(toListItem(structuredClone(item)))
  }

  return { updated: updatedItems.length, items: updatedItems }
}

export function getPricingByIds(ids: string[]): PriceItem[] {
  return inventoryPricingDb.pricing.filter((item) => ids.includes(item.id))
}
