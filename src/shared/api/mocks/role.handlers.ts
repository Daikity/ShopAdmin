import { http, HttpResponse } from 'msw'
import { ROLE_DEFINITIONS } from '@/entities/role'
import { applyNetworkSimulation } from './networkSimulation'

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

export const roleHandlers = [
  http.get('/api/roles', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const network = await applyNetworkSimulation(150)
    if (!network.ok) {
      return HttpResponse.json(
        { message: network.message },
        { status: network.status },
      )
    }

    return HttpResponse.json(ROLE_DEFINITIONS)
  }),
]
