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

export const updatePriceSchema = z.object({
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  compareAtPrice: z.number().min(0).nullable(),
})

export type UpdatePriceFormValues = z.infer<typeof updatePriceSchema>

export const bulkPriceSchema = z.object({
  mode: z.enum(['percent', 'fixed']),
  value: z.number().refine((value) => value !== 0, 'Значение не может быть 0'),
})

export type BulkPriceFormValues = z.infer<typeof bulkPriceSchema>
