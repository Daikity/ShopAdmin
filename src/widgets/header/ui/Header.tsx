import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LogoutButton,
  getSession,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from '@/features/auth'
import { RoleSwitcher } from '@/features/role-switch'
import { BurgerIcon, CloseIcon } from '@/shared/ui'

type HeaderProps = {
  mobileNavOpen: boolean
  onToggleMobileNav: () => void
}

export function Header({ mobileNavOpen, onToggleMobileNav }: HeaderProps) {
  const { t } = useTranslation()
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const session = getSession()

  return (
    <div className="flex h-14 items-center gap-3 px-4 md:px-6">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary transition-colors hover:bg-surface-muted lg:hidden"
        onClick={onToggleMobileNav}
        aria-label={mobileNavOpen ? t('shell.closeMenu') : t('shell.openMenu')}
        aria-expanded={mobileNavOpen}
      >
        {mobileNavOpen ? <CloseIcon /> : <BurgerIcon />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-small text-text-secondary">
          {t('shell.tagline')}
        </p>
      </div>
      {session ? (
        <span className="hidden text-small text-text-secondary lg:inline">
          {session.name}
        </span>
      ) : null}
      <RoleSwitcher />
      <LogoutButton />
    </div>
  )
}
