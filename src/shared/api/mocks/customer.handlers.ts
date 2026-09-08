import { delay, http, HttpResponse } from 'msw'
import type { CustomerStatus } from '@/entities/customer'
import { getCustomerDetails, listCustomers } from './customers.logic'

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

export const customerHandlers = [
  http.get('/api/customers', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(220)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    return HttpResponse.json(
      listCustomers({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search: url.searchParams.get('search') ?? undefined,
        status:
          (url.searchParams.get('status') as CustomerStatus | null) ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
      }),
    )
  }),

  http.get('/api/customers/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(180)

    const customer = getCustomerDetails(String(params.id))
    if (!customer) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(customer)
  }),
]
