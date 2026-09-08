import { useEffect, useMemo, useState } from 'react'
import { ROLE_DEFINITIONS } from '@/entities/role'
import { useCan } from '@/features/role-switch'
import { useDebouncedValue } from '@/shared/lib'
import { useGetUsersQuery } from '@/shared/api/usersApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { UserTable } from '@/widgets/user-table'
import { useUsersFilters } from '../model/useUsersFilters'

export function UsersPage() {
  const canRead = useCan('users.read')
  const { filters, setFilters, resetFilters } = useUsersFilters()
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const queryArgs = useMemo(
    () => ({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      role: filters.role,
      status: filters.status,
      sort: filters.sort,
    }),
    [filters],
  )

  const { data, isLoading, isError, isFetching, isSuccess } =
    useGetUsersQuery(queryArgs, { skip: !canRead })

  useEffect(() => {
    const nextSearch = debouncedSearch.trim() || undefined
    if (nextSearch === filters.search) return
    setFilters({ search: nextSearch, page: 1 })
  }, [debouncedSearch, filters.search, setFilters])

  if (!canRead) {
    return (
      <section>
        <PageHeader title="Users" description="Нет доступа (users.read)." />
        <p className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          Переключите demo role на Admin или Manager.
        </p>
      </section>
    )
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.role || filters.status,
  )

  return (
    <section>
      <PageHeader
        title="Users"
        description="Пользователи админки. Доступ зависит от Role Switcher."
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Поиск по имени / email"
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label="Поиск users"
        />
        <Select
          ariaLabel="Role"
          value={filters.role ?? ''}
          options={[
            { value: '', label: 'Все роли' },
            ...ROLE_DEFINITIONS.map((role) => ({
              value: role.id,
              label: role.name,
            })),
          ]}
          onChange={(value) =>
            setFilters({
              role: (value || undefined) as typeof filters.role,
              page: 1,
            })
          }
        />
        <Select
          ariaLabel="Status"
          value={filters.status ?? ''}
          options={[
            { value: '', label: 'Все статусы' },
            { value: 'active', label: 'active' },
            { value: 'invited', label: 'invited' },
            { value: 'disabled', label: 'disabled' },
          ]}
          onChange={(value) =>
            setFilters({
              status: (value || undefined) as typeof filters.status,
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

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={
          hasActiveFilters
            ? 'Нет пользователей по фильтрам'
            : 'Пока нет пользователей'
        }
        errorMessage="Не удалось загрузить users"
      >
        <UserTable
          items={data?.items ?? []}
          emptyMessage="Нет пользователей"
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {data.total} users · стр. {data.page}/{data.totalPages}
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
