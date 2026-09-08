import { delay, http, HttpResponse } from 'msw'
import { buildDashboardData } from './dashboard.logic'

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

export const dashboardHandlers = [
  http.get('/api/dashboard', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(280)

    const url = new URL(request.url)
    const from = url.searchParams.get('from') ?? undefined
    const to = url.searchParams.get('to') ?? undefined

    return HttpResponse.json(buildDashboardData({ from, to }))
  }),
]
