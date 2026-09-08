import type { UsersListParams, UsersListResponse } from '@/entities/user'
import { baseApi } from './baseApi'

function cleanParams(params: UsersListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersListResponse, UsersListParams>({
      query: (params) => ({
        url: '/users',
        params: cleanParams(params),
      }),
      providesTags: ['User'],
    }),
  }),
})

export const { useGetUsersQuery } = usersApi
