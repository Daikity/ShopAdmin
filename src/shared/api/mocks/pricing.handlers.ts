import { delay, http, HttpResponse } from 'msw'
import type { BulkPriceRequest, UpdatePricePayload } from '@/entities/pricing'
import { bulkUpdatePrices, listPricing, updatePrice } from './pricing.logic'

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

export const pricingHandlers = [
  http.get('/api/pricing', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(220)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    return HttpResponse.json(
      listPricing({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search: url.searchParams.get('search') ?? undefined,
        categoryId: url.searchParams.get('categoryId') ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
      }),
    )
  }),

  http.patch('/api/pricing/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(280)

    const body = (await request.json()) as Omit<UpdatePricePayload, 'id'>
    const result = updatePrice({
      id: String(params.id),
      price: Number(body.price),
      compareAtPrice:
        body.compareAtPrice === undefined || body.compareAtPrice === null
          ? null
          : Number(body.compareAtPrice),
    })

    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status },
      )
    }

    return HttpResponse.json(result.item)
  }),

  http.post('/api/pricing/bulk', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(400)

    const body = (await request.json()) as BulkPriceRequest
    if (!Array.isArray(body.ids) || body.ids.length === 0 || !body.mode) {
      return HttpResponse.json({ message: 'Invalid bulk payload' }, { status: 400 })
    }

    return HttpResponse.json(bulkUpdatePrices(body))
  }),
]
