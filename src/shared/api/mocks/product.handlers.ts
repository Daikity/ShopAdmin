import { delay, http, HttpResponse } from 'msw'
import type { ProductStatus, ProductWritePayload } from '@/entities/product'
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  listCategories,
  listProducts,
  updateProduct,
} from './products.logic'

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

export const productHandlers = [
  http.get('/api/categories', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(120)
    return HttpResponse.json(listCategories())
  }),

  http.get('/api/products', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(250)

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')
    const search = url.searchParams.get('search') ?? undefined
    const status = (url.searchParams.get('status') as ProductStatus | null) ?? undefined
    const categoryId = url.searchParams.get('categoryId') ?? undefined
    const sort = url.searchParams.get('sort') ?? undefined

    return HttpResponse.json(
      listProducts({
        page: Number.isFinite(page) ? page : 1,
        limit: Number.isFinite(limit) ? limit : 20,
        search,
        status,
        categoryId,
        sort,
      }),
    )
  }),

  http.get('/api/products/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(200)

    const product = getProductDetails(String(params.id))
    if (!product) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  http.post('/api/products', async ({ request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(300)

    const body = (await request.json()) as ProductWritePayload
    const created = createProduct(body)
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch('/api/products/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(300)

    const body = (await request.json()) as Partial<ProductWritePayload>
    const updated = updateProduct(String(params.id), body)
    if (!updated) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  http.delete('/api/products/:id', async ({ params, request }) => {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    await delay(250)

    const ok = deleteProduct(String(params.id))
    if (!ok) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json({ ok: true })
  }),
]
