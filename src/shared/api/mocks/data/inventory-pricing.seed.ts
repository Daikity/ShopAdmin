import type { InventoryItem, Warehouse } from '@/entities/inventory'
import { LOW_STOCK_THRESHOLD_DEFAULT } from '@/entities/inventory'
import type { PriceItem } from '@/entities/pricing'
import { categories, productsDb } from './products.seed'

function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export const warehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Main Hub' },
  { id: 'wh-2', name: 'East Depot' },
  { id: 'wh-3', name: 'West Depot' },
]

function categoryName(categoryId: string) {
  return categories.find((item) => item.id === categoryId)?.name ?? 'Unknown'
}

function buildInventoryAndPricing() {
  const rng = createRng(20260907)
  const inventory: InventoryItem[] = []
  const pricing: PriceItem[] = []

  productsDb.products.forEach((product, index) => {
    const warehouseCount = index % 4 === 0 ? 2 : 1
    for (let w = 0; w < warehouseCount; w += 1) {
      const warehouse = warehouses[(index + w) % warehouses.length]!
      const available = Math.floor(rng() * 90)
      inventory.push({
        id: `inv-${product.id}-${warehouse.id}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        categoryName: categoryName(product.categoryId),
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        available,
        reserved: Math.floor(rng() * Math.min(12, available + 1)),
        incoming: Math.floor(rng() * 20),
        lowStockThreshold: LOW_STOCK_THRESHOLD_DEFAULT,
        updatedAt: product.updatedAt,
      })
    }

    const compareAt =
      rng() > 0.55
        ? Math.round(product.price * (1.1 + rng() * 0.4) * 100) / 100
        : null
    const cost = Math.round(product.price * (0.45 + rng() * 0.25) * 100) / 100

    pricing.push({
      id: `price-${product.id}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      price: product.price,
      compareAtPrice: compareAt,
      cost,
      updatedAt: product.updatedAt,
    })
  })

  return { inventory, pricing }
}

export const inventoryPricingDb = buildInventoryAndPricing()
