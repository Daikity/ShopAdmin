import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/auth/probe', ({ request }) => {
    const auth = request.headers.get('Authorization')

    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = auth.slice('Bearer '.length)

    if (!token || token === 'force-401') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return HttpResponse.json({ ok: true })
  }),
]
