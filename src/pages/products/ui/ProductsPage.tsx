import { useEffect, useMemo, useState } from 'react'
import { CreateProductButton } from '@/features/product-create'
import { ProductBulkBar } from '@/features/product-bulk-update'
import { useDebouncedValue } from '@/shared/lib'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/shared/api/productsApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { ProductTable } from '@/widgets/product-table'
import { useProductsFilters } from '../model/useProductsFilters'

export function ProductsPage() {
  const { filters, setFilters, resetFilters } = useProductsFilters()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      status: filters.status,
      categoryId: filters.categoryId,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetProductsQuery(queryArgs)
  const { data: categories = [] } = useGetCategoriesQuery()

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Все статусы' },
      { value: 'active', label: 'active' },
      { value: 'draft', label: 'draft' },
      { value: 'archived', label: 'archived' },
    ],
    [],
  )

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Все категории' },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categories],
  )

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.categoryId,
  )

  const emptyMessage = !hasActiveFilters
    ? 'Пока нет товаров'
    : 'Нет товаров по текущим фильтрам'

  function handleSort(field: string) {
    const [currentField, currentOrder] = (filters.sort ?? 'updatedAt:desc').split(
      ':',
    )
    const nextOrder =
      currentField === field && currentOrder === 'asc' ? 'desc' : 'asc'
    setFilters({ sort: `${field}:${nextOrder}`, page: 1 })
  }

  return (
    <section>
      <PageHeader
        title="Catalog"
        description="Товары, URL-фильтры и bulk operations с partial success."
        actions={<CreateProductButton />}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск товаров"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск товаров"
        />
        <Select
          ariaLabel="Статус"
          value={filters.status ?? ''}
          options={statusOptions}
          onChange={(value) =>
            setFilters({
              status: (value || undefined) as typeof filters.status,
              page: 1,
            })
          }
        />
        <Select
          ariaLabel="Категория"
          value={filters.categoryId ?? ''}
          options={categoryOptions}
          onChange={(value) =>
            setFilters({
              categoryId: value || undefined,
              page: 1,
            })
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

      <ProductBulkBar
        selectedIds={selectedIds}
        categories={categories}
        onClearSelection={() => setSelectedIds([])}
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={emptyMessage}
        errorMessage="Не удалось загрузить товары"
      >
        <ProductTable
          items={data?.items ?? []}
          selectedIds={selectedIds}
          sort={filters.sort}
          onSort={handleSort}
          emptyMessage={emptyMessage}
          onToggle={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
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
    </section>
  )
}
