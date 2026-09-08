import type { TFunction } from 'i18next'
import { z } from 'zod'

const productStatusSchema = z.enum(['active', 'draft', 'archived'])

export function createProductFormSchema(t: TFunction) {
  return z.object({
    name: z.string().min(2, t('validation.product.nameRequired')),
    description: z.string().min(1, t('validation.product.descriptionRequired')),
    brand: z.string().min(1, t('validation.product.brandRequired')),
    categoryId: z.string().min(1, t('validation.product.categoryRequired')),
    tags: z.string(),
    status: productStatusSchema,
    sku: z.string().min(1, t('validation.product.skuRequired')),
    barcode: z.string().min(1, t('validation.product.barcodeRequired')),
    weight: z.number().min(0, t('validation.product.weightNegative')),
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
    price: z.number().min(0, t('validation.product.priceNegative')),
    stock: z.number().int().min(0),
    seoTitle: z.string(),
    seoDescription: z.string(),
  })
}

export type ProductFormValues = z.infer<ReturnType<typeof createProductFormSchema>>

export const productFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  status: productStatusSchema.optional().catch(undefined),
  categoryId: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined)),
  sort: z
    .string()
    .regex(/^(name|sku|price|stock|updatedAt):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type ProductFilters = z.infer<typeof productFiltersSchema>
