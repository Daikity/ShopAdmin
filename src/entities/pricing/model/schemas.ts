import type { TFunction } from 'i18next'
import { z } from 'zod'

export const pricingFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  categoryId: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined)),
  sort: z
    .string()
    .regex(/^(productName|sku|price|margin|updatedAt):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type PricingFilters = z.infer<typeof pricingFiltersSchema>

export function createUpdatePriceSchema(t: TFunction) {
  return z.object({
    price: z.number().min(0, t('validation.pricing.priceNegative')),
    compareAtPrice: z.number().min(0).nullable(),
  })
}

export type UpdatePriceFormValues = z.infer<
  ReturnType<typeof createUpdatePriceSchema>
>

export function createBulkPriceSchema(t: TFunction) {
  return z.object({
    mode: z.enum(['percent', 'fixed']),
    value: z
      .number()
      .refine((value) => value !== 0, t('validation.pricing.bulkValueZero')),
  })
}

export type BulkPriceFormValues = z.infer<ReturnType<typeof createBulkPriceSchema>>
