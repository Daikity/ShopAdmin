import { NavLink } from 'react-router-dom'
import { mainNavItems } from '@/shared/config/navigation'

type SidebarProps = {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-5">
        <p className="text-caption font-medium tracking-wide text-text-secondary uppercase">
          Admin
        </p>
        <p className="text-h2 text-accent">ShopAdmin</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Основная навигация">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'block rounded-md px-3 py-2 text-small font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
