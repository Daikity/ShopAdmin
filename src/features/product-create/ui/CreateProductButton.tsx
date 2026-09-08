import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProductForm } from '@/entities/product'
import { notifyToast } from '@/shared/lib'
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
} from '@/shared/api/productsApi'

export function CreateProductButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { data: categories = [] } = useGetCategoriesQuery()
  const [createProduct, { isLoading }] = useCreateProductMutation()

  if (!open) {
    return (
      <button
        type="button"
        className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground hover:bg-accent-hover"
        onClick={() => setOpen(true)}
      >
        {t('products.createButton')}
      </button>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('products.createDialogAria')}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-surface p-5 shadow-overlay">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-h2">{t('products.createTitle')}</h2>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-small"
            onClick={() => setOpen(false)}
          >
            {t('common.close')}
          </button>
        </div>
        <ProductForm
          categories={categories}
          submitLabel={t('products.createSubmit')}
          isSubmitting={isLoading}
          onSubmit={async (payload) => {
            const created = await createProduct(payload).unwrap()
            notifyToast({
              tone: 'success',
              message: t('products.toast.created'),
            })
            setOpen(false)
            navigate(`/catalog/products/${created.id}`)
          }}
        />
      </div>
    </div>
  )
}
