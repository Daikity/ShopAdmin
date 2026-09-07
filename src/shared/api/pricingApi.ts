import type {
  BulkPriceRequest,
  PriceListItem,
  PricingListParams,
  PricingListResponse,
  UpdatePricePayload,
} from '@/entities/pricing'
import { calcDiscount, calcMargin } from '@/entities/pricing'
import { baseApi } from './baseApi'

function cleanParams(params: PricingListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPricing: build.query<PricingListResponse, PricingListParams>({
      query: (params) => ({
        url: '/pricing',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Pricing' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Pricing' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Pricing' as const, id: 'LIST' }],
    }),
    updatePrice: build.mutation<PriceListItem, UpdatePricePayload>({
      query: ({ id, ...body }) => ({
        url: `/pricing/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Pricing', id: arg.id },
        { type: 'Pricing', id: 'LIST' },
      ],
    }),
    bulkUpdatePrices: build.mutation<
      { updated: number; items: PriceListItem[] },
      BulkPriceRequest
    >({
      query: (body) => ({
        url: '/pricing/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Pricing', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetPricingQuery,
  useUpdatePriceMutation,
  useBulkUpdatePricesMutation,
} = pricingApi

export { calcDiscount, calcMargin }
