import { productFiltersSchema, type ProductFilters } from '@/entities/product'
import { useUrlFilters } from '@/shared/lib'
import { productsFilterDefaults } from './productsParams'

export function useProductsFilters() {
  return useUrlFilters<ProductFilters>({
    schema: productFiltersSchema,
    defaults: productsFilterDefaults,
  })
}
