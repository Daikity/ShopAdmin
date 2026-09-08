export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'received'
  | 'refunded'

export type ReturnItem = {
  id: string
  number: string
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  productId: string
  productName: string
  reason: string
  amount: number
  status: ReturnStatus
  createdAt: string
  updatedAt: string
  note?: string
}

export type ReturnListItem = ReturnItem

export type ReturnsListParams = {
  page: number
  limit: number
  search?: string
  status?: ReturnStatus
  sort?: string
}

export type ReturnsListResponse = {
  items: ReturnListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ChangeReturnStatusPayload = {
  id: string
  status: ReturnStatus
}
