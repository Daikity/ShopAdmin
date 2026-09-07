import { useEffect, useMemo, useState } from 'react'
import type { PriceListItem } from '@/entities/pricing'
import { PriceBulkBar } from '@/features/price-bulk-update'
import { EditPriceDialog } from '@/features/price-edit'
import { useDebouncedValue } from '@/shared/lib'
import { useGetCategoriesQuery } from '@/shared/api/productsApi'
import { useGetPricingQuery } from '@/shared/api/pricingApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { PricingTable } from '@/widgets/pricing-table'
import { usePricingFilters } from '../model/usePricingFilters'

export function PricingPage() {
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

  const hasActiveFilters = Boolean(filters.search || filters.categoryId)
  const emptyMessage = !hasActiveFilters
    ? 'Пока нет цен'
    : 'Нет цен по текущим фильтрам'

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
        title="Pricing"
        description="Редактирование цен и bulk update с обязательным preview."
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-3">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск по товару / SKU"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск pricing"
        />
        <Select
          ariaLabel="Category"
          value={filters.categoryId ?? ''}
          options={[
            { value: '', label: 'Все категории' },
            ...categories.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
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
          Сбросить
        </button>
      </div>

      <PriceBulkBar
        selectedIds={selectedIds}
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedIds([])}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage="Не удалось загрузить pricing"
      >
        <PricingTable
          items={data?.items ?? []}
          selectedIds={selectedIds}
          emptyMessage={emptyMessage}
          sort={filters.sort}
          onSort={handleSort}
          onEdit={setEditItem}
          onToggle={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
            )
          }
          onToggleAll={(ids) =>
            setSelectedIds((prev) =>
              ids.every((id) => prev.includes(id))
                ? prev.filter((id) => !ids.includes(id))
                : [...new Set([...prev, ...ids])],
            )
          }
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {data.total} товаров · стр. {data.page}/{data.totalPages}
              {selectedIds.length > 0 ? ` · выбрано ${selectedIds.length}` : ''}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page <= 1}
                onClick={() => setFilters({ page: data.page - 1 })}
              >
                Назад
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
                disabled={data.page >= data.totalPages}
                onClick={() => setFilters({ page: data.page + 1 })}
              >
                Далее
              </button>
            </div>
          </div>
        ) : null}
      </QueryState>

      <EditPriceDialog item={editItem} onClose={() => setEditItem(null)} />
    </section>
  )
}
