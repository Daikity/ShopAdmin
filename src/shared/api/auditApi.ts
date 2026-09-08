import type { AuditListParams, AuditListResponse } from '@/entities/audit'
import { baseApi } from './baseApi'

function cleanParams(params: AuditListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const auditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLog: build.query<AuditListResponse, AuditListParams>({
      query: (params) => ({
        url: '/audit-log',
        params: cleanParams(params),
      }),
      providesTags: ['Audit'],
    }),
  }),
})

export const { useGetAuditLogQuery } = auditApi
