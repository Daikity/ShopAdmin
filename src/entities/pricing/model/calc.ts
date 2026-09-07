import type { BulkPriceMode, BulkPricePreview, PriceItem } from './types'

export function calcMargin(price: number, cost: number): number {
  if (price <= 0) return 0
  return Math.round(((price - cost) / price) * 10000) / 100
}

export function calcDiscount(
  price: number,
  compareAtPrice: number | null,
): number {
  if (!compareAtPrice || compareAtPrice <= 0 || compareAtPrice <= price) {
    return 0
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 10000) / 100
}

export function applyPriceAdjustment(
  price: number,
  mode: BulkPriceMode,
  value: number,
): number {
  const next =
    mode === 'percent' ? price * (1 + value / 100) : price + value
  return Math.max(0, Math.round(next * 100) / 100)
}

export function buildBulkPricePreview(
  items: Pick<PriceItem, 'id' | 'productName' | 'sku' | 'price'>[],
  mode: BulkPriceMode,
  value: number,
): BulkPricePreview {
  const previewItems = items.map((item) => ({
    id: item.id,
    productName: item.productName,
    sku: item.sku,
    oldPrice: item.price,
    newPrice: applyPriceAdjustment(item.price, mode, value),
  }))

  const oldTotal =
    Math.round(previewItems.reduce((sum, item) => sum + item.oldPrice, 0) * 100) /
    100
  const newTotal =
    Math.round(previewItems.reduce((sum, item) => sum + item.newPrice, 0) * 100) /
    100

  return {
    items: previewItems,
    oldTotal,
    newTotal,
    count: previewItems.length,
  }
}
