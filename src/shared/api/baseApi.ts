import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/** Единый RTK Query API — endpoints подключаются через injectEndpoints. */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [],
  endpoints: () => ({}),
})
