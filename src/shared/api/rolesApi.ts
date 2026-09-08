import type { RoleDefinition } from '@/entities/role'
import { baseApi } from './baseApi'

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<RoleDefinition[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
  }),
})

export const { useGetRolesQuery } = rolesApi
