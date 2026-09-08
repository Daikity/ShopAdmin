import { http, HttpResponse } from 'msw'
import type { RoleId } from '@/entities/role'
import type { UserStatus } from '@/entities/user'
import { applyNetworkSimulation } from './networkSimulation'
import { listUsers } from './users.logic'

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

export const userHandlers = [
  http.get('/api/users', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const network = await applyNetworkSimulation(200)
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
      listUsers({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search: url.searchParams.get('search') ?? undefined,
        role: (url.searchParams.get('role') as RoleId | null) ?? undefined,
        status:
          (url.searchParams.get('status') as UserStatus | null) ?? undefined,
        sort: url.searchParams.get('sort') ?? undefined,
      }),
    )
  }),
]
