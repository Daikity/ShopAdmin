import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PriceListItem } from '@/entities/pricing'
import { PriceBulkBar } from '@/features/price-bulk-update'
import { EditPriceDialog } from '@/features/price-edit'
import { useCan } from '@/features/role-switch'
import { useDebouncedValue } from '@/shared/lib'
import { useGetCategoriesQuery } from '@/shared/api/productsApi'
import { useGetPricingQuery } from '@/shared/api/pricingApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { PricingTable } from '@/widgets/pricing-table'
import { usePricingFilters } from '../model/usePricingFilters'

export function PricingPage() {
  const { t } = useTranslation()
  const canWrite = useCan('products.write')
  const { filters, setFilters, resetFilters } = usePricingFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editItem, setEditItem] = useState<PriceListItem | null>(null)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      categoryId: filters.categoryId,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetPricingQuery(queryArgs)
  const { data: categories = [] } = useGetCategoriesQuery()

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const selectedItems = useMemo(
    () => (data?.items ?? []).filter((item) => selectedIds.includes(item.id)),
    [data?.items, selectedIds],
  )

  const categoryOptions = useMemo(
    () => [
      { value: '', label: t('common.allCategories') },
      ...categories.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [categories, t],
  )

  const hasActiveFilters = Boolean(filters.search || filters.categoryId)
  const emptyMessage = !hasActiveFilters
    ? t('pricing.empty')
    : t('pricing.emptyFiltered')

  function handleSort(field: string) {
    const [currentField, currentOrder] = (
      filters.sort ?? 'updatedAt:desc'
    ).split(':')
    const nextOrder =
      currentField === field && currentOrder === 'asc' ? 'desc' : 'asc'
    setFilters({ sort: `${field}:${nextOrder}`, page: 1 })
  }

  return (
    <section>
      <PageHeader
        title={t('pricing.pageTitle')}
        description={t('pricing.pageDescription')}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('pricing.searchPlaceholder')}
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label={t('pricing.searchAria')}
        />
        <Select
          ariaLabel={t('pricing.categoryAria')}
          value={filters.categoryId ?? ''}
          options={categoryOptions}
          onChange={(value) =>
            setFilters({ categoryId: value || undefined, page: 1 })
          }
        />
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small"
          onClick={() => {
            setSearchInput('')
            resetFilters()
          }}
        >
          {t('common.reset')}
        </button>
      </div>

      {canWrite ? (
        <PriceBulkBar
          selectedIds={selectedIds}
          selectedItems={selectedItems}
          onClearSelection={() => setSelectedIds([])}
        />
      ) : null}

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage={t('pricing.loadError')}
      >
        <PricingTable
          items={data?.items ?? []}
          selectedIds={selectedIds}
          emptyMessage={emptyMessage}
          sort={filters.sort}
          onSort={handleSort}
          onEdit={canWrite ? setEditItem : () => undefined}
          onToggle={
            canWrite
              ? (id) =>
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((item) => item !== id)
                      : [...prev, id],
                  )
              : () => undefined
          }
          onToggleAll={
            canWrite
              ? (ids) =>
                  setSelectedIds((prev) =>
                    ids.every((id) => prev.includes(id))
                      ? prev.filter((id) => !ids.includes(id))
                      : [...new Set([...prev, ...ids])],
                  )
              : () => undefined
          }
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {selectedIds.length > 0
                ? t('pricing.paginationSelected', {
                    total: data.total,
                    page: data.page,
                    totalPages: data.totalPages,
                    selected: selectedIds.length,
                  })
                : t('pricing.pagination', {
                    total: data.total,
                    page: data.page,
                    totalPages: data.totalPages,
                  })}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page <= 1}
                onClick={() => setFilters({ page: data.page - 1 })}
              >
                {t('common.prev')}
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page >= data.totalPages}
                onClick={() => setFilters({ page: data.page + 1 })}
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        ) : null}
      </QueryState>

      <EditPriceDialog item={editItem} onClose={() => setEditItem(null)} />
    </section>
  )
}
