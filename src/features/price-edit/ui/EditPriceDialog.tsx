import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PriceListItem, UpdatePriceFormValues } from '@/entities/pricing'
import { updatePriceSchema } from '@/entities/pricing'
import { notifyToast } from '@/shared/lib'
import { useUpdatePriceMutation } from '@/shared/api/pricingApi'

type EditPriceDialogProps = {
  item: PriceListItem | null
  onClose: () => void
}

export function EditPriceDialog({ item, onClose }: EditPriceDialogProps) {
  const [updatePrice, { isLoading }] = useUpdatePriceMutation()
  const form = useForm<UpdatePriceFormValues>({
    resolver: zodResolver(updatePriceSchema),
    values: item
      ? {
          price: item.price,
          compareAtPrice: item.compareAtPrice,
        }
      : {
          price: 0,
          compareAtPrice: null,
        },
  })

  if (!item) return null

  async function submit(values: UpdatePriceFormValues) {
    try {
      await updatePrice({
        id: item!.id,
        price: values.price,
        compareAtPrice: values.compareAtPrice,
      }).unwrap()
      notifyToast({ tone: 'success', message: `${item!.sku}: price updated` })
      onClose()
    } catch {
      notifyToast({ tone: 'error', message: 'Price update failed' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-price-title"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-overlay">
        <h2 id="edit-price-title" className="text-h2">
          Edit price
        </h2>
        <p className="mt-1 text-small text-text-secondary">
          {item.productName} · {item.sku}
        </p>
        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(submit)}>
          <label className="block text-small">
            Current price (€)
            <input
              type="number"
              step="0.01"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
              {...form.register('price', { valueAsNumber: true })}
            />
          </label>
          <label className="block text-small">
            Compare-at (€)
            <input
              type="number"
              step="0.01"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
              {...form.register('compareAtPrice', {
                setValueAs: (value) => {
                  if (value === '' || value === null || Number.isNaN(Number(value))) {
                    return null
                  }
                  return Number(value)
                },
              })}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-md border border-border px-3 py-2 text-small"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-accent px-3 py-2 text-small font-semibold text-accent-foreground disabled:opacity-60"
            >
              {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
