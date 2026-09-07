import type {
  Product,
  ProductDetails,
  ProductListItem,
  ProductsListParams,
  ProductsListResponse,
  ProductWritePayload,
} from '@/entities/product'
import { categories, productsDb } from './data/products.seed'

function categoryName(categoryId: string) {
  return categories.find((item) => item.id === categoryId)?.name ?? 'Unknown'
}

function toListItem(product: Product): ProductListItem {
  return {
    ...product,
    categoryName: categoryName(product.categoryId),
  }
}

export function listCategories() {
  return categories
}

export function listProducts(params: ProductsListParams): ProductsListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered = [...productsDb.products]

  if (search) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search),
    )
  }

  if (params.status) {
    filtered = filtered.filter((product) => product.status === params.status)
  }

  if (params.categoryId) {
    filtered = filtered.filter(
      (product) => product.categoryId === params.categoryId,
    )
  }

  const [sortField, sortOrder] = (params.sort ?? 'updatedAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof Product]
    const right = b[sortField as keyof Product]
    if (typeof left === 'number' && typeof right === 'number') {
      return sortOrder === 'asc' ? left - right : right - left
    }
    const leftText = String(left ?? '')
    const rightText = String(right ?? '')
    return sortOrder === 'asc'
      ? leftText.localeCompare(rightText)
      : rightText.localeCompare(leftText)
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.limit
  const items = filtered.slice(start, start + params.limit).map(toListItem)

  return { items, total, page, limit: params.limit, totalPages }
}

export function getProductDetails(id: string): ProductDetails | null {
  const product = productsDb.products.find((item) => item.id === id)
  if (!product) {
    return null
  }

  return {
    ...toListItem(product),
    variants: productsDb.variants.filter((item) => item.productId === id),
  }
}

export function createProduct(payload: ProductWritePayload): ProductDetails {
  const id = `prod-${String(productsDb.products.length + 1).padStart(3, '0')}`
  const now = new Date().toISOString()
  const product: Product = {
    id,
    ...payload,
    tags: payload.tags,
    imageUrl: `https://picsum.photos/seed/${id}/80/80`,
    variantsCount: 1,
    updatedAt: now,
    createdAt: now,
  }

  productsDb.products.unshift(product)
  productsDb.variants.push({
    id: `var-${String(productsDb.variants.length + 1).padStart(3, '0')}`,
    productId: id,
    sku: `${payload.sku}-1`,
    barcode: payload.barcode,
    attributes: {},
    price: payload.price,
    compareAtPrice: null,
    stock: payload.stock,
    weight: payload.weight,
    status: payload.status,
  })

  return getProductDetails(id)!
}

export function updateProduct(
  id: string,
  payload: Partial<ProductWritePayload>,
): ProductDetails | null {
  const index = productsDb.products.findIndex((item) => item.id === id)
  if (index < 0) {
    return null
  }

  const current = productsDb.products[index]!
  productsDb.products[index] = {
    ...current,
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return getProductDetails(id)
}

export function deleteProduct(id: string): boolean {
  const before = productsDb.products.length
  productsDb.products = productsDb.products.filter((item) => item.id !== id)
  productsDb.variants = productsDb.variants.filter(
    (item) => item.productId !== id,
  )
  return productsDb.products.length < before
}
