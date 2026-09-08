import type { DashboardData, DashboardParams } from '@/entities/dashboard'
import { baseApi } from './baseApi'

function cleanParams(params: DashboardParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query<DashboardData, DashboardParams>({
      query: (params) => ({
        url: '/dashboard',
        params: cleanParams(params),
      }),
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetDashboardQuery } = dashboardApi
