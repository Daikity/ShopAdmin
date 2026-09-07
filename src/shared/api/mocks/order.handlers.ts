import { delay, http, HttpResponse } from 'msw'
import type {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from '@/entities/order'
import {
  changeOrderStatus,
  getOrderDetails,
  listOrders,
} from './orders.logic'

function requireAuth(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const token = auth.slice('Bearer '.length)
  if (!token || token === 'force-401') {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export const orderHandlers = [
  http.get('/api/orders', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(250)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')
    const search = url.searchParams.get('search') ?? undefined
    const status = (url.searchParams.get('status') as OrderStatus | null) ?? undefined
    const paymentStatus =
      (url.searchParams.get('paymentStatus') as PaymentStatus | null) ?? undefined
    const fulfillmentStatus =
      (url.searchParams.get('fulfillmentStatus') as FulfillmentStatus | null) ??
      undefined
    const sort = url.searchParams.get('sort') ?? undefined

    return HttpResponse.json(
      listOrders({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search,
        status,
        paymentStatus,
        fulfillmentStatus,
        sort,
      }),
    )
  }),

  http.get('/api/orders/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(200)

    const order = getOrderDetails(String(params.id))
    if (!order) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),

  http.patch('/api/orders/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(350)

    const body = (await request.json()) as { status?: OrderStatus }
    if (!body.status) {
      return HttpResponse.json({ message: 'status is required' }, { status: 400 })
    }

    const result = changeOrderStatus(String(params.id), body.status)
    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status },
      )
    }

    return HttpResponse.json(result.order)
  }),
]
