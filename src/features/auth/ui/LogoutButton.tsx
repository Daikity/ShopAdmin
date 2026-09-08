import { useTranslation } from 'react-i18next'
import { logout } from '../model/session'

type LogoutButtonProps = {
  onLoggedOut?: () => void
}

export function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className="rounded-md border border-border px-3 py-1.5 text-small font-medium text-text-primary hover:bg-surface-muted"
      onClick={() => {
        logout()
        onLoggedOut?.()
      }}
    >
      {t('auth.logout')}
    </button>
  )
}
