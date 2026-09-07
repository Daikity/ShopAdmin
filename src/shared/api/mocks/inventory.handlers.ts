import { delay, http, HttpResponse } from 'msw'
import type { StockStatus } from '@/entities/inventory'
import {
  adjustStock,
  listInventory,
  listWarehouses,
} from './inventory.logic'

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

export const inventoryHandlers = [
  http.get('/api/warehouses', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(100)
    return HttpResponse.json(listWarehouses())
  }),

  http.get('/api/inventory', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(220)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    return HttpResponse.json(
      listInventory({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search: url.searchParams.get('search') ?? undefined,
        warehouseId: url.searchParams.get('warehouseId') ?? undefined,
        stockStatus:
          (url.searchParams.get('stockStatus') as StockStatus | null) ??
          undefined,
        categoryId: url.searchParams.get('categoryId') ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
      }),
    )
  }),

  http.patch('/api/inventory/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(320)

    const body = (await request.json()) as {
      adjustment?: number
      reason?: string
    }

    const result = adjustStock({
      id: String(params.id),
      adjustment: Number(body.adjustment),
      reason: String(body.reason ?? ''),
    })

    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status },
      )
    }

    return HttpResponse.json(result.item)
  }),
]
