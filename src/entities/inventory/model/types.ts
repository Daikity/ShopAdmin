export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type Warehouse = {
  id: string
  name: string
}

export type InventoryItem = {
  id: string
  productId: string
  productName: string
  sku: string
  categoryId: string
  categoryName: string
  warehouseId: string
  warehouseName: string
  available: number
  reserved: number
  incoming: number
  lowStockThreshold: number
  updatedAt: string
}

export type InventoryListItem = InventoryItem & {
  stockStatus: StockStatus
}

export type InventoryListParams = {
  page: number
  limit: number
  search?: string
  warehouseId?: string
  stockStatus?: StockStatus
  categoryId?: string
  sort?: string
}

export type InventoryListResponse = {
  items: InventoryListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AdjustStockPayload = {
  id: string
  adjustment: number
  reason: string
}
