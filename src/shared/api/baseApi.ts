import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { notifyUnauthorized, readAuthToken } from './authBridge'

function resolveApiBaseUrl() {
  if (typeof window === 'undefined') {
    return '/api'
  }
  return `${window.location.origin}/api`
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: resolveApiBaseUrl(),
  prepareHeaders: (headers) => {
    const token = readAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    notifyUnauthorized()
  }

  return result
}

/** Единый RTK Query API — endpoints подключаются через injectEndpoints. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Product',
    'Category',
    'Order',
    'Inventory',
    'Pricing',
    'Return',
    'Customer',
    'Dashboard',
    'Report',
    'User',
    'Role',
    'Audit',
  ],
  endpoints: () => ({}),
})
