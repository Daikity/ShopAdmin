import { delay, http, HttpResponse } from 'msw'
import type { ReturnStatus } from '@/entities/return'
import { changeReturnStatus, getReturn, listReturns } from './returns.logic'

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

export const returnHandlers = [
  http.get('/api/returns', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(220)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    return HttpResponse.json(
      listReturns({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search: url.searchParams.get('search') ?? undefined,
        status:
          (url.searchParams.get('status') as ReturnStatus | null) ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
      }),
    )
  }),

  http.get('/api/returns/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(160)
    const item = getReturn(String(params.id))
    if (!item) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  http.patch('/api/returns/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(300)

    const body = (await request.json()) as { status?: ReturnStatus }
    if (!body.status) {
      return HttpResponse.json({ message: 'status is required' }, { status: 400 })
    }

    const result = changeReturnStatus(String(params.id), body.status)
    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status },
      )
    }
    return HttpResponse.json(result.item)
  }),
]
