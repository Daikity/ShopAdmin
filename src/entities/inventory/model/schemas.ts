import { z } from 'zod'

const stockStatusSchema = z.enum(['in_stock', 'low_stock', 'out_of_stock'])

export const inventoryFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  warehouseId: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined)),
  stockStatus: stockStatusSchema.optional().catch(undefined),
  categoryId: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined)),
  sort: z
    .string()
    .regex(/^(productName|sku|available|updatedAt):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type InventoryFilters = z.infer<typeof inventoryFiltersSchema>

export const adjustStockSchema = z.object({
  adjustment: z
    .number()
    .int('Только целое число')
    .refine((value) => value !== 0, 'Adjustment не может быть 0'),
  reason: z.string().min(2, 'Укажите причину'),
})

export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>
