import { z } from 'zod'
import { ROLE_IDS } from '@/entities/role'

const roleSchema = z.enum(ROLE_IDS)
const statusSchema = z.enum(['active', 'invited', 'disabled'])

export const userFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(20),
  search: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim()
      return trimmed ? trimmed : undefined
    }),
  role: roleSchema.optional().catch(undefined),
  status: statusSchema.optional().catch(undefined),
  sort: z
    .string()
    .regex(/^(name|email|role|createdAt|lastLoginAt):(asc|desc)$/)
    .optional()
    .catch(undefined),
})

export type UserFilters = z.infer<typeof userFiltersSchema>
