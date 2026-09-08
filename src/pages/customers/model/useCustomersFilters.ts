import {
  customerFiltersSchema,
  type CustomerFilters,
} from '@/entities/customer'
import { useUrlFilters } from '@/shared/lib'
import { customersFilterDefaults } from './customersParams'

export function useCustomersFilters() {
  return useUrlFilters<CustomerFilters>({
    schema: customerFiltersSchema,
    defaults: customersFilterDefaults,
  })
}
