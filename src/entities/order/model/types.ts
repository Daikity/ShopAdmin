export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'partial'
  | 'fulfilled'
  | 'returned'

export type OrderItem = {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export type OrderAddress = {
  name: string
  line1: string
  city: string
  postalCode: string
  country: string
}

export type OrderTimelineEvent = {
  id: string
  at: string
  type: string
  message: string
}

export type OrderNote = {
  id: string
  at: string
  author: string
  text: string
}

export type Order = {
  id: string
  number: string
  customerId: string
  customerName: string
  customerEmail: string
  createdAt: string
  updatedAt: string
  itemsCount: number
  total: number
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  status: OrderStatus
  currency: 'EUR'
}

export type OrderListItem = Order

export type OrderDetails = Order & {
  items: OrderItem[]
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  timeline: OrderTimelineEvent[]
  notes: OrderNote[]
}

export type OrdersListParams = {
  page: number
  limit: number
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  fulfillmentStatus?: FulfillmentStatus
  sort?: string
}

export type OrdersListResponse = {
  items: OrderListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ChangeOrderStatusPayload = {
  id: string
  status: OrderStatus
}
