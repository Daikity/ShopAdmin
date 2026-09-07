import { baseApi } from './baseApi'
import type {
  BulkProductsRequest,
  BulkProductsResult,
  Category,
  ProductDetails,
  ProductsListParams,
  ProductsListResponse,
  ProductWritePayload,
} from '@/entities/product'

function cleanParams(params: ProductsListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getProducts: build.query<ProductsListResponse, ProductsListParams>({
      query: (params) => ({
        url: '/products',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Product' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Product' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getProduct: build.query<ProductDetails, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: build.mutation<ProductDetails, ProductWritePayload>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: build.mutation<
      ProductDetails,
      { id: string; body: Partial<ProductWritePayload> }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Product', id: arg.id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: build.mutation<{ ok: true }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    bulkProducts: build.mutation<BulkProductsResult, BulkProductsRequest>({
      query: (body) => ({
        url: '/products/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) =>
        arg.action.type === 'export'
          ? []
          : [{ type: 'Product', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkProductsMutation,
} = productsApi
