import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '@/entities/product'
import { notifyToast } from '@/shared/lib'
import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductQuery,
  useUpdateProductMutation,
} from '@/shared/api/productsApi'
import { PageHeader, QueryState } from '@/shared/ui'

const tabs = [
  'General',
  'Media',
  'Variants',
  'Pricing',
  'Inventory',
  'SEO',
  'Activity',
] as const

type Tab = (typeof tabs)[number]

export function ProductDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('General')

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetProductQuery(id, { skip: !id })
  const { data: categories = [] } = useGetCategoriesQuery()
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  return (
    <section>
      <PageHeader
        title={data?.name ?? 'Product'}
        description={data ? `${data.sku} · ${data.categoryName}` : 'Карточка товара'}
        back={{ to: '/catalog/products' }}
        actions={
          data ? (
            <button
              type="button"
              disabled={isDeleting}
              className="rounded-md border border-danger/40 px-3 py-2 text-small text-danger"
              onClick={async () => {
                if (!window.confirm(`Удалить «${data.name}»?`)) return
                await deleteProduct(data.id).unwrap()
                notifyToast({ tone: 'success', message: 'Товар удалён' })
                navigate('/catalog/products')
              }}
            >
              Удалить
            </button>
          ) : null
        }
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage="Товар не найден или недоступен"
      >
        {data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'rounded-md px-3 py-1.5 text-small font-medium',
                    tab === item
                      ? 'bg-accent text-accent-foreground'
                      : 'text-text-secondary hover:bg-surface-muted',
                  ].join(' ')}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {tab === 'General' || tab === 'SEO' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <ProductForm
                  key={`${data.id}-${data.updatedAt}`}
                  categories={categories}
                  initial={data}
                  submitLabel="Сохранить"
                  isSubmitting={isSaving}
                  onSubmit={async (payload) => {
                    await updateProduct({ id: data.id, body: payload }).unwrap()
                    notifyToast({ tone: 'success', message: 'Товар обновлён' })
                  }}
                />
              </div>
            ) : null}

            {tab === 'Media' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="h-40 w-40 rounded-md object-cover"
                />
              </div>
            ) : null}

            {tab === 'Variants' ? (
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="w-full text-left text-small">
                  <thead className="bg-surface-muted text-caption text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">SKU</th>
                      <th className="px-3 py-2">Attributes</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.variants.map((variant) => (
                      <tr key={variant.id} className="border-t border-border">
                        <td className="px-3 py-2">{variant.sku}</td>
                        <td className="px-3 py-2">
                          {Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ') || '—'}
                        </td>
                        <td className="px-3 py-2">€{variant.price.toFixed(2)}</td>
                        <td className="px-3 py-2">{variant.stock}</td>
                        <td className="px-3 py-2 capitalize">{variant.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {tab === 'Pricing' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small">
                <p>Базовая цена: €{data.price.toFixed(2)}</p>
                <p className="text-text-secondary">
                  Compare-at и bulk pricing — этап Pricing.
                </p>
              </div>
            ) : null}

            {tab === 'Inventory' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small">
                <p>Доступно (сумма variants): {data.stock}</p>
                <p className="text-text-secondary">
                  Adjust stock — этап Inventory.
                </p>
              </div>
            ) : null}

            {tab === 'Activity' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small text-text-secondary">
                Activity / audit по товару появится вместе с Audit Log.
              </div>
            ) : null}
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
