export type PriceItem = {
  id: string
  productId: string
  productName: string
  sku: string
  categoryId: string
  price: number
  compareAtPrice: number | null
  cost: number
  updatedAt: string
}

export type PriceListItem = PriceItem & {
  margin: number
  discount: number
}

export type PricingListParams = {
  page: number
  limit: number
  search?: string
  categoryId?: string
  sort?: string
}

export type PricingListResponse = {
  items: PriceListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type UpdatePricePayload = {
  id: string
  price: number
  compareAtPrice: number | null
}

export type BulkPriceMode = 'percent' | 'fixed'

export type BulkPriceRequest = {
  ids: string[]
  mode: BulkPriceMode
  value: number
}

export type BulkPricePreviewItem = {
  id: string
  productName: string
  sku: string
  oldPrice: number
  newPrice: number
}

export type BulkPricePreview = {
  items: BulkPricePreviewItem[]
  oldTotal: number
  newTotal: number
  count: number
}
