import { NavLink } from 'react-router-dom'
import { can } from '@/entities/role'
import { useDemoRole } from '@/features/role-switch'
import { mainNavItems } from '@/shared/config/navigation'
import { cn } from '@/shared/lib'
import { NavIcon } from '@/shared/ui'

type SidebarProps = {
  /** rail — иконки, подписи по hover родителя; drawer — полный вид */
  variant?: 'rail' | 'drawer'
  onNavigate?: () => void
}

export function Sidebar({ variant = 'rail', onNavigate }: SidebarProps) {
  const isDrawer = variant === 'drawer'
  const role = useDemoRole()
  const items = mainNavItems.filter(
    (item) => !item.permission || can(role, item.permission),
  )

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-14 items-center border-b border-border',
          isDrawer
            ? 'gap-3 px-4'
            : 'justify-center px-2 group-hover/nav:justify-start group-hover/nav:gap-3 group-hover/nav:px-4',
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-caption font-bold text-accent-foreground">
          SA
        </span>
        <div
          className={cn(
            'min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200',
            isDrawer
              ? 'opacity-100'
              : 'w-0 opacity-0 group-hover/nav:w-auto group-hover/nav:opacity-100',
          )}
        >
          <p className="text-caption font-medium tracking-wide text-text-secondary uppercase">
            Admin
          </p>
          <p className="text-small font-semibold text-accent">ShopAdmin</p>
        </div>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2"
        aria-label="Основная навигация"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md py-2 text-small font-medium transition-colors',
                isDrawer
                  ? 'gap-3 px-3'
                  : 'justify-center px-2 group-hover/nav:justify-start group-hover/nav:gap-3 group-hover/nav:px-3',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
              )
            }
          >
            <NavIcon id={item.icon} />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-opacity duration-200',
                isDrawer
                  ? 'opacity-100'
                  : 'w-0 opacity-0 group-hover/nav:w-auto group-hover/nav:opacity-100',
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
