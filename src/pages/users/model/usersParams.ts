import { userFiltersSchema, type UserFilters } from '@/entities/user'

export const usersFilterDefaults: UserFilters = {
  page: 1,
  limit: 20,
  search: undefined,
  role: undefined,
  status: undefined,
  sort: 'createdAt:desc',
}

export { userFiltersSchema }
