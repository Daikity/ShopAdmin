import type {
  ChangeReturnStatusPayload,
  ReturnItem,
  ReturnsListParams,
  ReturnsListResponse,
} from '@/entities/return'
import { baseApi } from './baseApi'

function cleanParams(params: ReturnsListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const returnsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReturns: build.query<ReturnsListResponse, ReturnsListParams>({
      query: (params) => ({
        url: '/returns',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Return' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Return' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Return' as const, id: 'LIST' }],
    }),
    getReturn: build.query<ReturnItem, string>({
      query: (id) => `/returns/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Return', id }],
    }),
    changeReturnStatus: build.mutation<ReturnItem, ChangeReturnStatusPayload>({
      query: ({ id, status }) => ({
        url: `/returns/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, error, arg) =>
        error
          ? []
          : [
              { type: 'Return', id: arg.id },
              { type: 'Return', id: 'LIST' },
              { type: 'Customer', id: 'LIST' },
            ],
    }),
  }),
})

export const {
  useGetReturnsQuery,
  useGetReturnQuery,
  useChangeReturnStatusMutation,
} = returnsApi
