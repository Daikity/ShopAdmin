import { useMemo, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  createProductFormSchema,
  type ProductFormValues,
} from '../model/schemas'
import type {
  Category,
  ProductDetails,
  ProductWritePayload,
} from '../model/types'

type ProductFormProps = {
  categories: Category[]
  initial?: ProductDetails
  submitLabel: string
  onSubmit: (payload: ProductWritePayload) => Promise<void> | void
  isSubmitting?: boolean
}

function toFormValues(product?: ProductDetails): ProductFormValues {
  if (!product) {
    return {
      name: '',
      description: '',
      brand: '',
      categoryId: '',
      tags: '',
      status: 'draft',
      sku: '',
      barcode: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      price: 0,
      stock: 0,
      seoTitle: '',
      seoDescription: '',
    }
  }

  return {
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    tags: product.tags.join(', '),
    status: product.status,
    sku: product.sku,
    barcode: product.barcode,
    weight: product.weight,
    length: product.dimensions.length,
    width: product.dimensions.width,
    height: product.dimensions.height,
    price: product.price,
    stock: product.stock,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
  }
}

function toPayload(values: ProductFormValues): ProductWritePayload {
  return {
    name: values.name,
    description: values.description,
    brand: values.brand,
    categoryId: values.categoryId,
    tags: values.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: values.status,
    sku: values.sku,
    barcode: values.barcode,
    weight: values.weight,
    dimensions: {
      length: values.length,
      width: values.width,
      height: values.height,
    },
    price: values.price,
    stock: values.stock,
    seoTitle: values.seoTitle,
    seoDescription: values.seoDescription,
  }
}

export function ProductForm({
  categories,
  initial,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createProductFormSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(initial),
  })

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(toPayload(values))
      })}
    >
      <Field label={t('products.form.name')} error={errors.name?.message}>
        <input className={inputClass} {...register('name')} />
      </Field>
      <Field label={t('products.form.brand')} error={errors.brand?.message}>
        <input className={inputClass} {...register('brand')} />
      </Field>
      <Field label={t('products.form.sku')} error={errors.sku?.message}>
        <input className={inputClass} {...register('sku')} />
      </Field>
      <Field label={t('products.form.barcode')} error={errors.barcode?.message}>
        <input className={inputClass} {...register('barcode')} />
      </Field>
      <Field
        label={t('products.form.category')}
        error={errors.categoryId?.message}
      >
        <select className={inputClass} {...register('categoryId')}>
          <option value="">{t('products.form.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('products.form.status')} error={errors.status?.message}>
        <select className={inputClass} {...register('status')}>
          <option value="active">{t('enums.productStatus.active')}</option>
          <option value="draft">{t('enums.productStatus.draft')}</option>
          <option value="archived">{t('enums.productStatus.archived')}</option>
        </select>
      </Field>
      <Field label={t('products.form.price')} error={errors.price?.message}>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          {...register('price', { valueAsNumber: true })}
        />
      </Field>
      <Field label={t('products.form.stock')} error={errors.stock?.message}>
        <input
          type="number"
          className={inputClass}
          {...register('stock', { valueAsNumber: true })}
        />
      </Field>
      <Field label={t('products.form.weight')} error={errors.weight?.message}>
        <input
          type="number"
          step="0.01"
          className={inputClass}
          {...register('weight', { valueAsNumber: true })}
        />
      </Field>
      <Field label={t('products.form.tags')} error={errors.tags?.message}>
        <input className={inputClass} {...register('tags')} />
      </Field>
      <div className="md:col-span-2">
        <Field
          label={t('products.form.description')}
          error={errors.description?.message}
        >
          <textarea
            className={inputClass}
            rows={3}
            {...register('description')}
          />
        </Field>
      </div>
      <Field label={t('products.form.length')} error={errors.length?.message}>
        <input
          type="number"
          className={inputClass}
          {...register('length', { valueAsNumber: true })}
        />
      </Field>
      <Field label={t('products.form.width')} error={errors.width?.message}>
        <input
          type="number"
          className={inputClass}
          {...register('width', { valueAsNumber: true })}
        />
      </Field>
      <Field label={t('products.form.height')} error={errors.height?.message}>
        <input
          type="number"
          className={inputClass}
          {...register('height', { valueAsNumber: true })}
        />
      </Field>
      <Field
        label={t('products.form.seoTitle')}
        error={errors.seoTitle?.message}
      >
        <input className={inputClass} {...register('seoTitle')} />
      </Field>
      <div className="md:col-span-2">
        <Field
          label={t('products.form.seoDescription')}
          error={errors.seoDescription?.message}
        >
          <textarea
            className={inputClass}
            rows={2}
            {...register('seoDescription')}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent px-4 py-2.5 text-small font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-60"
        >
          {isSubmitting ? t('products.form.saving') : submitLabel}
        </button>
      </div>
    </form>
  )
}

const inputClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-text-primary'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-small font-medium">{label}</span>
      {children}
      {error ? (
        <span className="text-caption text-danger" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
