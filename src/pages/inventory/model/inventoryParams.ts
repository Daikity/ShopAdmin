import { inventoryFiltersSchema, type InventoryFilters } from '@/entities/inventory'

export const inventoryFilterDefaults: InventoryFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  warehouseId: undefined,
  stockStatus: undefined,
  categoryId: undefined,
  sort: 'updatedAt:desc',
}

export { inventoryFiltersSchema }
