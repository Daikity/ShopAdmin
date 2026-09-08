import { userFiltersSchema, type UserFilters } from '@/entities/user'
import { useUrlFilters } from '@/shared/lib'
import { usersFilterDefaults } from './usersParams'

export function useUsersFilters() {
  return useUrlFilters<UserFilters>({
    schema: userFiltersSchema,
    defaults: usersFilterDefaults,
  })
}
