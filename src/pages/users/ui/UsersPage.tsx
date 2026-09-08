import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ROLE_DEFINITIONS } from '@/entities/role'
import { useCan } from '@/features/role-switch'
import { useDebouncedValue } from '@/shared/lib'
import { useGetUsersQuery } from '@/shared/api/usersApi'
import { PageHeader, QueryState, Select } from '@/shared/ui'
import { UserTable } from '@/widgets/user-table'
import { useUsersFilters } from '../model/useUsersFilters'

export function UsersPage() {
  const { t } = useTranslation()
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
        <PageHeader
          title={t('users.pageTitle')}
          description={t('users.accessDenied')}
        />
        <p className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          {t('common.accessDeniedSwitchRole')}
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
        title={t('users.pageTitle')}
        description={t('users.pageDescription')}
      />

      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-surface p-3 md:grid-cols-4">
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('users.searchPlaceholder')}
          className="h-10 rounded-md border border-border px-3 text-small"
          aria-label={t('users.searchAria')}
        />
        <Select
          ariaLabel={t('users.roleAria')}
          value={filters.role ?? ''}
          options={[
            { value: '', label: t('users.allRoles') },
            ...ROLE_DEFINITIONS.map((role) => ({
              value: role.id,
              label: t(`enums.demoRole.${role.id}`, {
                defaultValue: role.name,
              }),
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
          ariaLabel={t('users.statusAria')}
          value={filters.status ?? ''}
          options={[
            { value: '', label: t('common.allStatuses') },
            { value: 'active', label: t('enums.userStatus.active') },
            { value: 'invited', label: t('enums.userStatus.invited') },
            { value: 'disabled', label: t('enums.userStatus.disabled') },
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
          {t('common.reset')}
        </button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.items.length ?? 0) === 0}
        emptyMessage={
          hasActiveFilters ? t('users.emptyFiltered') : t('users.empty')
        }
        errorMessage={t('users.loadError')}
      >
        <UserTable
          items={data?.items ?? []}
          emptyMessage={t('users.emptyTable')}
        />
        {data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-small text-text-secondary">
            <p>
              {t('users.pagination', {
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
    </section>
  )
}
