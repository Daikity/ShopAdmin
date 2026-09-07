import type {
  ChangeOrderStatusPayload,
  OrderDetails,
  OrdersListParams,
  OrdersListResponse,
} from '@/entities/order'
import { deriveStatusesFromOrderStatus } from '@/entities/order'
import { baseApi } from './baseApi'

function cleanParams(params: OrdersListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

function applyOptimisticStatus(draft: {
  status: OrderDetails['status']
  paymentStatus: OrderDetails['paymentStatus']
  fulfillmentStatus: OrderDetails['fulfillmentStatus']
  updatedAt: string
}, status: OrderDetails['status']) {
  const derived = deriveStatusesFromOrderStatus(status)
  draft.status = status
  draft.paymentStatus = derived.paymentStatus
  draft.fulfillmentStatus = derived.fulfillmentStatus
  draft.updatedAt = new Date().toISOString()
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<OrdersListResponse, OrdersListParams>({
      query: (params) => ({
        url: '/orders',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Order' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Order' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),
    getOrder: build.query<OrderDetails, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    changeOrderStatus: build.mutation<OrderDetails, ChangeOrderStatusPayload>({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
        const patches: Array<{ undo: () => void }> = []

        patches.push(
          dispatch(
            ordersApi.util.updateQueryData('getOrder', id, (draft) => {
              applyOptimisticStatus(draft, status)
            }),
          ),
        )

        for (const args of ordersApi.util.selectCachedArgsForQuery(
          getState(),
          'getOrders',
        )) {
          patches.push(
            dispatch(
              ordersApi.util.updateQueryData('getOrders', args, (draft) => {
                const item = draft.items.find((order) => order.id === id)
                if (item) {
                  applyOptimisticStatus(item, status)
                }
              }),
            ),
          )
        }

        try {
          await queryFulfilled
        } catch {
          for (const patch of patches) {
            patch.undo()
          }
        }
      },
      invalidatesTags: (_result, error, arg) =>
        error
          ? []
          : [
              { type: 'Order', id: arg.id },
              { type: 'Order', id: 'LIST' },
            ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useChangeOrderStatusMutation,
} = ordersApi
