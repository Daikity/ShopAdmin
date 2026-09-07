import { orderFiltersSchema, type OrderFilters } from '@/entities/order'
import { useUrlFilters } from '@/shared/lib'
import { ordersFilterDefaults } from './ordersParams'

export function useOrdersFilters() {
  return useUrlFilters<OrderFilters>({
    schema: orderFiltersSchema,
    defaults: ordersFilterDefaults,
  })
}
