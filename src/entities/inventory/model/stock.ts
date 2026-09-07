import type { StockStatus } from './types'

export const LOW_STOCK_THRESHOLD_DEFAULT = 10

export function resolveStockStatus(
  available: number,
  threshold = LOW_STOCK_THRESHOLD_DEFAULT,
): StockStatus {
  if (available <= 0) return 'out_of_stock'
  if (available <= threshold) return 'low_stock'
  return 'in_stock'
}

export function applyStockAdjustment(
  available: number,
  adjustment: number,
): number {
  return Math.max(0, available + adjustment)
}
