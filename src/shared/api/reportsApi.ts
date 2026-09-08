import type { ReportsData, ReportsParams } from '@/entities/report'
import { baseApi } from './baseApi'

function cleanParams(params: ReportsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query<ReportsData, ReportsParams>({
      query: (params) => ({
        url: '/reports',
        params: cleanParams(params),
      }),
      providesTags: ['Report'],
    }),
  }),
})

export const { useGetReportsQuery } = reportsApi
