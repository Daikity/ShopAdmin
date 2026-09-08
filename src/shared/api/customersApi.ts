import type {
  CustomerDetails,
  CustomersListParams,
  CustomersListResponse,
} from '@/entities/customer'
import { baseApi } from './baseApi'

function cleanParams(params: CustomersListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query<CustomersListResponse, CustomersListParams>({
      query: (params) => ({
        url: '/customers',
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Customer' as const, id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Customer' as const,
                id: item.id,
              })),
            ]
          : [{ type: 'Customer' as const, id: 'LIST' }],
    }),
    getCustomer: build.query<CustomerDetails, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),
  }),
})

export const { useGetCustomersQuery, useGetCustomerQuery } = customersApi
