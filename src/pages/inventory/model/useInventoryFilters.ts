import { inventoryFiltersSchema, type InventoryFilters } from '@/entities/inventory'
import { useUrlFilters } from '@/shared/lib'
import { inventoryFilterDefaults } from './inventoryParams'

export function useInventoryFilters() {
  return useUrlFilters<InventoryFilters>({
    schema: inventoryFiltersSchema,
    defaults: inventoryFilterDefaults,
  })
}
