import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { z } from 'zod'

type UseUrlFiltersOptions<T extends object> = {
  schema: z.ZodType<T>
  defaults: T
}

function toSearchParams(
  values: Record<string, unknown>,
  current: URLSearchParams,
) {
  const next = new URLSearchParams(current)

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === '') {
      next.delete(key)
      continue
    }
    next.set(key, String(value))
  }

  return next
}

/**
 * URL → Zod validate/normalize → typed filters.
 * Только нужный API для ShopAdmin (без универсального form-engine).
 */
export function useUrlFilters<T extends object>({
  schema,
  defaults,
}: UseUrlFiltersOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo((): T => {
    const raw = Object.fromEntries(searchParams.entries())
    const parsed = schema.safeParse({ ...defaults, ...raw })
    return parsed.success ? parsed.data : defaults
  }, [searchParams, schema, defaults])

  function setFilters(patch: Partial<T>) {
    const nextValues = { ...filters, ...patch }
    const parsed = schema.safeParse(nextValues)
    const values = (parsed.success ? parsed.data : nextValues) as Record<
      string,
      unknown
    >
    setSearchParams(toSearchParams(values, searchParams), { replace: true })
  }

  function resetFilters() {
    setSearchParams(
      toSearchParams(defaults as Record<string, unknown>, new URLSearchParams()),
      { replace: true },
    )
  }

  return { filters, setFilters, resetFilters, searchParams }
}
