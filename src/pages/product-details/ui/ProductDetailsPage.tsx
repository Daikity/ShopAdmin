import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '@/entities/product'
import { formatMoney, notifyToast } from '@/shared/lib'
import {
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductQuery,
  useUpdateProductMutation,
} from '@/shared/api/productsApi'
import { PageHeader, QueryState } from '@/shared/ui'

const TAB_KEYS = [
  'general',
  'media',
  'variants',
  'pricing',
  'inventory',
  'seo',
  'activity',
] as const

type Tab = (typeof TAB_KEYS)[number]

export function ProductDetailsPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('general')

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetProductQuery(id, { skip: !id })
  const { data: categories = [] } = useGetCategoriesQuery()
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  return (
    <section>
      <PageHeader
        title={data?.name ?? t('products.detailsFallbackTitle')}
        description={
          data
            ? `${data.sku} · ${data.categoryName}`
            : t('products.detailsFallbackDescription')
        }
        back={{ to: '/catalog/products' }}
        actions={
          data ? (
            <button
              type="button"
              disabled={isDeleting}
              className="rounded-md border border-danger/40 px-3 py-2 text-small text-danger"
              onClick={async () => {
                if (
                  !window.confirm(
                    t('products.details.deleteConfirm', { name: data.name }),
                  )
                )
                  return
                await deleteProduct(data.id).unwrap()
                notifyToast({
                  tone: 'success',
                  message: t('products.toast.deleted'),
                })
                navigate('/catalog/products')
              }}
            >
              {t('products.details.delete')}
            </button>
          ) : null
        }
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        errorMessage={t('products.detailsLoadError')}
      >
        {data ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 border-b border-border pb-2">
              {TAB_KEYS.map((item) => (
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
                  {t(`products.tab.${item}`)}
                </button>
              ))}
            </div>

            {tab === 'general' || tab === 'seo' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <ProductForm
                  key={`${data.id}-${data.updatedAt}`}
                  categories={categories}
                  initial={data}
                  submitLabel={t('products.details.save')}
                  isSubmitting={isSaving}
                  onSubmit={async (payload) => {
                    await updateProduct({ id: data.id, body: payload }).unwrap()
                    notifyToast({
                      tone: 'success',
                      message: t('products.toast.updated'),
                    })
                  }}
                />
              </div>
            ) : null}

            {tab === 'media' ? (
              <div className="rounded-lg border border-border bg-surface p-4">
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="h-40 w-40 rounded-md object-cover"
                />
              </div>
            ) : null}

            {tab === 'variants' ? (
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="w-full text-left text-small">
                  <thead className="bg-surface-muted text-caption text-text-secondary">
                    <tr>
                      <th className="px-3 py-2">{t('products.variants.sku')}</th>
                      <th className="px-3 py-2">
                        {t('products.variants.attributes')}
                      </th>
                      <th className="px-3 py-2">
                        {t('products.variants.price')}
                      </th>
                      <th className="px-3 py-2">
                        {t('products.variants.stock')}
                      </th>
                      <th className="px-3 py-2">
                        {t('products.variants.status')}
                      </th>
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
                        <td className="px-3 py-2">
                          {formatMoney(variant.price)}
                        </td>
                        <td className="px-3 py-2">{variant.stock}</td>
                        <td className="px-3 py-2">
                          {t(`enums.productStatus.${variant.status}`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {tab === 'pricing' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small">
                <p>
                  {t('products.pricing.basePrice', {
                    price: formatMoney(data.price),
                  })}
                </p>
                <p className="text-text-secondary">{t('products.pricing.hint')}</p>
              </div>
            ) : null}

            {tab === 'inventory' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small">
                <p>
                  {t('products.inventory.available', { stock: data.stock })}
                </p>
                <p className="text-text-secondary">
                  {t('products.inventory.hint')}
                </p>
              </div>
            ) : null}

            {tab === 'activity' ? (
              <div className="rounded-lg border border-border bg-surface p-4 text-small text-text-secondary">
                {t('products.activity.hint')}
              </div>
            ) : null}
          </div>
        ) : null}
      </QueryState>
    </section>
  )
}
