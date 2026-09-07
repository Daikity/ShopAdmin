import { baseApi } from './baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    authProbe: build.query<{ ok: true }, void>({
      query: () => '/auth/probe',
    }),
  }),
})

export const { useAuthProbeQuery, useLazyAuthProbeQuery } = authApi
