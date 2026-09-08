import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import type { AppDispatch, RootState } from '@/app/store'
import {
  resetSettings,
  setLocale,
  setNetworkSimulation,
  setTableDensity,
} from '@/app/store'
import type { AppLocale, TableDensity } from '@/shared/config/appSettings'
import { notifyToast } from '@/shared/lib'
import { Checkbox, PageHeader, Select } from '@/shared/ui'

export function SettingsPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const settings = useSelector((state: RootState) => state.settings)

  return (
    <section>
      <PageHeader
        title={t('settings.pageTitle')}
        description={t('settings.pageDescription')}
      />

      <div className="max-w-xl space-y-4 rounded-lg border border-border bg-surface p-4 shadow-panel">
        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('settings.localeLabel')}</p>
          <Select
            ariaLabel={t('settings.localeAria')}
            value={settings.locale}
            options={[
              { value: 'en', label: t('settings.locale.en') },
              { value: 'ru', label: t('settings.locale.ru') },
              { value: 'de', label: t('settings.locale.de') },
            ]}
            onChange={(value) => {
              dispatch(setLocale(value as AppLocale))
              notifyToast({
                tone: 'success',
                message: t('settings.toast.locale', { value }),
              })
            }}
          />
        </div>

        <div className="space-y-1 text-small">
          <p className="text-text-secondary">{t('settings.densityLabel')}</p>
          <Select
            ariaLabel={t('settings.densityAria')}
            value={settings.tableDensity}
            options={[
              {
                value: 'comfortable',
                label: t('settings.density.comfortable'),
              },
              { value: 'compact', label: t('settings.density.compact') },
            ]}
            onChange={(value) => {
              dispatch(setTableDensity(value as TableDensity))
              notifyToast({
                tone: 'success',
                message: t('settings.toast.density', { value }),
              })
            }}
          />
        </div>

        <Checkbox
          checked={settings.networkSimulation}
          onChange={(checked) => {
            dispatch(setNetworkSimulation(checked))
            notifyToast({
              tone: checked ? 'warning' : 'success',
              message: checked
                ? t('settings.toast.networkOn')
                : t('settings.toast.networkOff'),
            })
          }}
          label={t('settings.networkLabel')}
          description={t('settings.networkDescription')}
        />

        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 text-small transition hover:border-accent hover:bg-surface-muted"
          onClick={() => {
            dispatch(resetSettings())
            notifyToast({ tone: 'success', message: t('settings.toast.reset') })
          }}
        >
          {t('settings.reset')}
        </button>
      </div>
    </section>
  )
}
