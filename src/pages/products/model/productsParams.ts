import { productFiltersSchema, type ProductFilters } from '@/entities/product'

export const productsFilterDefaults: ProductFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  status: undefined,
  categoryId: undefined,
  sort: 'updatedAt:desc',
}

export { productFiltersSchema }
