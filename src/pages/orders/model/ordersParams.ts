import { orderFiltersSchema, type OrderFilters } from '@/entities/order'

export const ordersFilterDefaults: OrderFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  status: undefined,
  paymentStatus: undefined,
  fulfillmentStatus: undefined,
  sort: 'createdAt:desc',
}

export { orderFiltersSchema }
