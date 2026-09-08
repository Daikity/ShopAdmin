import type {
  Customer,
  CustomerDetails,
  CustomerListItem,
  CustomersListParams,
  CustomersListResponse,
} from '@/entities/customer'
import { customersReturnsDb } from './data/customers-returns.seed'

export function listCustomers(
  params: CustomersListParams,
): CustomersListResponse {
  const search = params.search?.trim().toLowerCase()
  let filtered: CustomerListItem[] = [...customersReturnsDb.customers]

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search),
    )
  }

  if (params.status) {
    filtered = filtered.filter((item) => item.status === params.status)
  }

  const [sortField, sortOrder] = (params.sort ?? 'createdAt:desc').split(':') as [
    string,
    'asc' | 'desc',
  ]

  filtered.sort((a, b) => {
    const left = a[sortField as keyof Customer]
    const right = b[sortField as keyof Customer]
    if (typeof left === 'number' && typeof right === 'number') {
      return sortOrder === 'asc' ? left - right : right - left
    }
    if (left === null || left === undefined) return sortOrder === 'asc' ? -1 : 1
    if (right === null || right === undefined) return sortOrder === 'asc' ? 1 : -1
    return sortOrder === 'asc'
      ? String(left).localeCompare(String(right))
      : String(right).localeCompare(String(left))
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / params.limit))
  const page = Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.limit

  return {
    items: filtered.slice(start, start + params.limit),
    total,
    page,
    limit: params.limit,
    totalPages,
  }
}

export function getCustomerDetails(id: string): CustomerDetails | null {
  const details = customersReturnsDb.customerDetails.get(id)
  return details ? structuredClone(details) : null
}
