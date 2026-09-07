import { z } from 'zod'

const productStatusSchema = z.enum(['active', 'draft', 'archived'])

export const productFormSchema = z.object({
  name: z.string().min(2, 'Укажите название'),
  description: z.string().min(1, 'Укажите описание'),
  brand: z.string().min(1, 'Укажите бренд'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  tags: z.string(),
  status: productStatusSchema,
  sku: z.string().min(1, 'Укажите SKU'),
  barcode: z.string().min(1, 'Укажите barcode'),
  weight: z.number().min(0, 'Вес не может быть отрицательным'),
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  stock: z.number().int().min(0),
  seoTitle: z.string(),
  seoDescription: z.string(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

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
