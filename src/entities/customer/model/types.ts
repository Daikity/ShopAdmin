export type CustomerStatus = 'active' | 'blocked' | 'invited'

export type Customer = {
  id: string
  name: string
  email: string
  ordersCount: number
  totalSpent: number
  lastOrderAt: string | null
  status: CustomerStatus
  createdAt: string
}

export type CustomerListItem = Customer

export type CustomerActivity = {
  id: string
  at: string
  type: string
  message: string
}

export type CustomerOrderSummary = {
  id: string
  number: string
  createdAt: string
  total: number
  status: string
}

export type CustomerReturnSummary = {
  id: string
  number: string
  createdAt: string
  amount: number
  status: string
}

export type CustomerDetails = Customer & {
  averageOrder: number
  orders: CustomerOrderSummary[]
  returns: CustomerReturnSummary[]
  activity: CustomerActivity[]
}

export type CustomersListParams = {
  page: number
  limit: number
  search?: string
  status?: CustomerStatus
  sort?: string
}

export type CustomersListResponse = {
  items: CustomerListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}
