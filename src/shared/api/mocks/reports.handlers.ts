import { delay, http, HttpResponse } from 'msw'
import type { PaymentStatus } from '@/entities/order'
import { buildReportsData } from './reports.logic'

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

export const reportsHandlers = [
  http.get('/api/reports', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(300)

    const url = new URL(request.url)
    const from = url.searchParams.get('from') ?? undefined
    const to = url.searchParams.get('to') ?? undefined
    const categoryId = url.searchParams.get('categoryId') ?? undefined
    const productId = url.searchParams.get('productId') ?? undefined
    const customerId = url.searchParams.get('customerId') ?? undefined
    const paymentStatus =
      (url.searchParams.get('paymentStatus') as PaymentStatus | null) ??
      undefined

    return HttpResponse.json(
      buildReportsData({
        from,
        to,
        categoryId,
        productId,
        customerId,
        paymentStatus,
      }),
    )
  }),
]
