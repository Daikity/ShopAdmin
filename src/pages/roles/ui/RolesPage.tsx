import { PERMISSIONS } from '@/entities/role'
import { useCan } from '@/features/role-switch'
import { useGetRolesQuery } from '@/shared/api/rolesApi'
import { PageHeader, QueryState } from '@/shared/ui'

export function RolesPage() {
  const canRead = useCan('users.read')
  const { data, isLoading, isError, isFetching, isSuccess } = useGetRolesQuery(
    undefined,
    { skip: !canRead },
  )

  if (!canRead) {
    return (
      <section>
        <PageHeader title="Roles" description="Нет доступа (users.read)." />
        <p className="rounded-md border border-border bg-surface p-6 text-small text-text-secondary">
          Переключите demo role на Admin или Manager.
        </p>
      </section>
    )
  }

  return (
    <section>
      <PageHeader
        title="Roles"
        description="Матрица permissions. UI capability через can() — не backend security."
      />

      <QueryState
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching && isSuccess}
        isEmpty={isSuccess && (data?.length ?? 0) === 0}
        emptyMessage="Нет ролей"
        errorMessage="Не удалось загрузить roles"
      >
        <div className="space-y-4">
          {(data ?? []).map((role) => (
            <article
              key={role.id}
              className="rounded-lg border border-border bg-surface p-4 shadow-panel"
            >
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-h2">{role.name}</h2>
                  <p className="text-small text-text-secondary">
                    {role.description}
                  </p>
                </div>
                <span className="text-caption text-text-secondary">
                  {role.permissions.length} permissions
                </span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {PERMISSIONS.map((permission) => {
                  const allowed = role.permissions.includes(permission)
                  return (
                    <li
                      key={permission}
                      className="flex items-center gap-2 text-small"
                    >
                      <span
                        aria-hidden
                        className={
                          allowed
                            ? 'text-success'
                            : 'text-text-secondary/40'
                        }
                      >
                        {allowed ? '✓' : '·'}
                      </span>
                      <span
                        className={
                          allowed
                            ? 'text-text-primary'
                            : 'text-text-secondary/60'
                        }
                      >
                        {permission}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
      </QueryState>
    </section>
  )
}
