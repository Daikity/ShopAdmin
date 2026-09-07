import type { ReactElement, ReactNode } from 'react'
import type { NavIconId } from '@/shared/config/navigation'

type IconProps = {
  className?: string
}

function IconShell({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  )
}

const icons: Record<NavIconId, (props: IconProps) => ReactElement> = {
  dashboard: (props) => (
    <IconShell {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </IconShell>
  ),
  catalog: (props) => (
    <IconShell {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </IconShell>
  ),
  orders: (props) => (
    <IconShell {...props}>
      <path d="M7 4h10l1 4H6l1-4Z" />
      <path d="M6 8v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </IconShell>
  ),
  customers: (props) => (
    <IconShell {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M21 19c0-2-1.5-3.5-3.5-4.2" />
    </IconShell>
  ),
  inventory: (props) => (
    <IconShell {...props}>
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
      <path d="M3 8.5V16l9 4.5" />
      <path d="M21 8.5V16l-9 4.5" />
    </IconShell>
  ),
  pricing: (props) => (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M9.5 9.5c.6-1 1.6-1.5 2.5-1.5 1.4 0 2.5.9 2.5 2s-1.1 2-2.5 2h-1c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2c.9 0 1.9-.5 2.5-1.5" />
    </IconShell>
  ),
  returns: (props) => (
    <IconShell {...props}>
      <path d="M4 10V5h5" />
      <path d="M4 5c3 4 6 6 10 6a6 6 0 1 1-2 11.6" />
    </IconShell>
  ),
  reports: (props) => (
    <IconShell {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5" />
      <path d="M12 16V8" />
      <path d="M16 16v-3" />
    </IconShell>
  ),
  users: (props) => (
    <IconShell {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </IconShell>
  ),
  roles: (props) => (
    <IconShell {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
      <path d="M16 4.5 18 6l-2 1.5" />
    </IconShell>
  ),
  audit: (props) => (
    <IconShell {...props}>
      <path d="M8 4h8a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2Z" />
      <path d="M10 9h4" />
      <path d="M10 13h4" />
    </IconShell>
  ),
  settings: (props) => (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M4.9 6.3l1.6 1.5M17.5 16.2l1.6 1.5M3 12h2.2M18.8 12H21M4.9 17.7l1.6-1.5M17.5 7.8l1.6-1.5" />
    </IconShell>
  ),
}

export function NavIcon({
  id,
  className = 'h-5 w-5 shrink-0',
}: {
  id: NavIconId
  className?: string
}) {
  const Icon = icons[id]
  return <Icon className={className} />
}

export function BurgerIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconShell>
  )
}

export function CloseIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <IconShell className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </IconShell>
  )
}
