import { http, HttpResponse } from 'msw'
import { applyNetworkSimulation } from './networkSimulation'
import { listAuditLog } from './audit.logic'

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

export const auditHandlers = [
  http.get('/api/audit-log', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const network = await applyNetworkSimulation(220)
    if (!network.ok) {
      return HttpResponse.json(
        { message: network.message },
        { status: network.status },
      )
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    return HttpResponse.json(
      listAuditLog({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        user: url.searchParams.get('user') ?? undefined,
        action: url.searchParams.get('action') ?? undefined,
        entity: url.searchParams.get('entity') ?? undefined,
        from: url.searchParams.get('from') ?? undefined,
        to: url.searchParams.get('to') ?? undefined,
      }),
    )
  }),
]
