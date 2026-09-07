import { useEffect, useMemo, useState } from 'react'
import type { InventoryListItem } from '@/entities/inventory'
import { AdjustStockDialog } from '@/features/inventory-adjust'
import { useDebouncedValue } from '@/shared/lib'
import { useGetCategoriesQuery } from '@/shared/api/productsApi'
import {
  useGetInventoryQuery,
  useGetWarehousesQuery,
} from '@/shared/api/inventoryApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { InventoryTable } from '@/widgets/inventory-table'
import { useInventoryFilters } from '../model/useInventoryFilters'

export function InventoryPage() {
  const { filters, setFilters, resetFilters } = useInventoryFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [adjustItem, setAdjustItem] = useState<InventoryListItem | null>(null)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      warehouseId: filters.warehouseId,
      stockStatus: filters.stockStatus,
      categoryId: filters.categoryId,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetInventoryQuery(queryArgs)
  const { data: warehouses = [] } = useGetWarehousesQuery()
  const { data: categories = [] } = useGetCategoriesQuery()

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.warehouseId ||
      filters.stockStatus ||
      filters.categoryId,
  )

  const emptyMessage = !hasActiveFilters
    ? 'Пока нет складских записей'
    : 'Нет записей по текущим фильтрам'

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
        title="Inventory"
        description="Склад, stock states и adjust с optimistic update + audit."
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск по товару / SKU"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск inventory"
        />
        <Select
          ariaLabel="Warehouse"
          value={filters.warehouseId ?? ''}
          options={[
            { value: '', label: 'Все склады' },
            ...warehouses.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
          onChange={(value) =>
            setFilters({ warehouseId: value || undefined, page: 1 })
          }
        />
        <Select
          ariaLabel="Stock status"
          value={filters.stockStatus ?? ''}
          options={[
            { value: '', label: 'Все stock' },
            { value: 'in_stock', label: 'In stock' },
            { value: 'low_stock', label: 'Low stock' },
            { value: 'out_of_stock', label: 'Out of stock' },
          ]}
          onChange={(value) =>
            setFilters({
              stockStatus: (value || undefined) as typeof filters.stockStatus,
              page: 1,
            })
          }
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
          className="h-10 rounded-md border border-border px-3 text-small md:col-span-4 md:w-fit"
          onClick={() => {
            setSearchInput('')
            resetFilters()
          }}
        >
          Сбросить
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage="Не удалось загрузить inventory"
      >
        <InventoryTable
          items={data?.items ?? []}
          emptyMessage={emptyMessage}
          sort={filters.sort}
          onSort={handleSort}
          onAdjust={setAdjustItem}
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {data.total} записей · стр. {data.page}/{data.totalPages}
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

      <AdjustStockDialog
        item={adjustItem}
        onClose={() => setAdjustItem(null)}
      />
    </section>
  )
}
