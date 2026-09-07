import { useMemo, useState } from 'react'
import { CreateProductButton } from '@/features/product-create'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/shared/api/productsApi'
import { PageHeader, QueryState } from '@/shared/ui'
import { ProductTable } from '@/widgets/product-table'
import { useProductsFilters } from '../model/useProductsFilters'

export function ProductsPage() {
  const { filters, setFilters, resetFilters } = useProductsFilters()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

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
        description="Товары, фильтры и URL state. Bulk — на следующем этапе."
        actions={<CreateProductButton />}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setFilters({ search: searchInput || undefined, page: 1 })
            }
          }}
          placeholder="Поиск (Enter)"
          className="rounded-md border border-border px-3 py-2 text-small"
          aria-label="Поиск товаров"
        />
        <select
          value={filters.status ?? ''}
          onChange={(event) =>
            setFilters({
              status: (event.target.value || undefined) as typeof filters.status,
              page: 1,
            })
          }
          className="rounded-md border border-border px-3 py-2 text-small"
          aria-label="Статус"
        >
          <option value="">Все статусы</option>
          <option value="active">active</option>
          <option value="draft">draft</option>
          <option value="archived">archived</option>
        </select>
        <select
          value={filters.categoryId ?? ''}
          onChange={(event) =>
            setFilters({
              categoryId: event.target.value || undefined,
              page: 1,
            })
          }
          className="rounded-md border border-border px-3 py-2 text-small"
          aria-label="Категория"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-2 text-small"
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
