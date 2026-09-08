import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

  const warehouseOptions = useMemo(
    () => [
      { value: '', label: t('inventory.allWarehouses') },
      ...warehouses.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [warehouses, t],
  )

  const stockOptions = useMemo(
    () => [
      { value: '', label: t('inventory.allStock') },
      { value: 'in_stock', label: t('enums.stockStatus.in_stock') },
      { value: 'low_stock', label: t('enums.stockStatus.low_stock') },
      { value: 'out_of_stock', label: t('enums.stockStatus.out_of_stock') },
    ],
    [t],
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

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.warehouseId ||
      filters.stockStatus ||
      filters.categoryId,
  )

  const emptyMessage = !hasActiveFilters
    ? t('inventory.empty')
    : t('inventory.emptyFiltered')

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
        title={t('inventory.pageTitle')}
        description={t('inventory.pageDescription')}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('inventory.searchPlaceholder')}
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label={t('inventory.searchAria')}
        />
        <Select
          ariaLabel={t('inventory.warehouseAria')}
          value={filters.warehouseId ?? ''}
          options={warehouseOptions}
          onChange={(value) =>
            setFilters({ warehouseId: value || undefined, page: 1 })
          }
        />
        <Select
          ariaLabel={t('inventory.stockAria')}
          value={filters.stockStatus ?? ''}
          options={stockOptions}
          onChange={(value) =>
            setFilters({
              stockStatus: (value || undefined) as typeof filters.stockStatus,
              page: 1,
            })
          }
        />
        <Select
          ariaLabel={t('inventory.categoryAria')}
          value={filters.categoryId ?? ''}
          options={categoryOptions}
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
          {t('common.reset')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage={t('inventory.loadError')}
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
              {t('inventory.pagination', {
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

      <AdjustStockDialog
        item={adjustItem}
        onClose={() => setAdjustItem(null)}
      />
    </section>
  )
}
