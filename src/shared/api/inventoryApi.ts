import type {
  AdjustStockPayload,
  InventoryListItem,
  InventoryListParams,
  InventoryListResponse,
  Warehouse,
} from '@/entities/inventory'
import { resolveStockStatus } from '@/entities/inventory'
import { baseApi } from './baseApi'

function cleanParams(params: InventoryListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWarehouses: build.query<Warehouse[], void>({
      query: () => '/warehouses',
    }),
    getInventory: build.query<InventoryListResponse, InventoryListParams>({
      query: (params) => ({
        url: '/inventory',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Inventory' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Inventory' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Inventory' as const, id: 'LIST' }],
    }),
    adjustStock: build.mutation<InventoryListItem, AdjustStockPayload>({
      query: ({ id, adjustment, reason }) => ({
        url: `/inventory/${id}`,
        method: 'PATCH',
        body: { adjustment, reason },
      }),
      async onQueryStarted(
        { id, adjustment },
        { dispatch, queryFulfilled, getState },
      ) {
        const patches: Array<{ undo: () => void }> = []

        for (const args of inventoryApi.util.selectCachedArgsForQuery(
          getState(),
          'getInventory',
        )) {
          patches.push(
            dispatch(
              inventoryApi.util.updateQueryData(
                'getInventory',
                args,
                (draft) => {
                  const item = draft.items.find((row) => row.id === id)
                  if (!item) return
                  item.available = Math.max(0, item.available + adjustment)
                  item.stockStatus = resolveStockStatus(
                    item.available,
                    item.lowStockThreshold,
                  )
                  item.updatedAt = new Date().toISOString()
                },
              ),
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
              { type: 'Inventory', id: arg.id },
              { type: 'Inventory', id: 'LIST' },
            ],
    }),
  }),
})

export const {
  useGetWarehousesQuery,
  useGetInventoryQuery,
  useAdjustStockMutation,
} = inventoryApi
