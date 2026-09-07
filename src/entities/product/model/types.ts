export type ProductStatus = 'active' | 'draft' | 'archived'

export type Category = {
  id: string
  name: string
}

export type ProductVariant = {
  id: string
  productId: string
  sku: string
  barcode: string
  attributes: Record<string, string>
  price: number
  compareAtPrice: number | null
  stock: number
  weight: number
  status: ProductStatus
}

export type Product = {
  id: string
  name: string
  description: string
  brand: string
  categoryId: string
  tags: string[]
  status: ProductStatus
  sku: string
  barcode: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  imageUrl: string
  price: number
  stock: number
  variantsCount: number
  updatedAt: string
  createdAt: string
  seoTitle: string
  seoDescription: string
}

export type ProductListItem = Product & {
  categoryName: string
}

export type ProductsListParams = {
  page: number
  limit: number
  search?: string
  status?: ProductStatus
  categoryId?: string
  sort?: string
}

export type ProductsListResponse = {
  items: ProductListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ProductDetails = Product & {
  categoryName: string
  variants: ProductVariant[]
}

export type ProductWritePayload = {
  name: string
  description: string
  brand: string
  categoryId: string
  tags: string[]
  status: ProductStatus
  sku: string
  barcode: string
  weight: number
  dimensions: Product['dimensions']
  price: number
  stock: number
  seoTitle: string
  seoDescription: string
}
