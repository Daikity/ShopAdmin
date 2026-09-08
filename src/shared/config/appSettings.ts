export type AppLocale = 'en' | 'ru' | 'de'
export type TableDensity = 'comfortable' | 'compact'

export type AppSettings = {
  locale: AppLocale
  tableDensity: TableDensity
  networkSimulation: boolean
}

export const APP_SETTINGS_KEY = 'shopadmin_settings'
export const DEMO_ROLE_KEY = 'shopadmin_demo_role'

export const DEFAULT_APP_SETTINGS: AppSettings = {
  locale: 'en',
  tableDensity: 'comfortable',
  networkSimulation: false,
}

/** Чтение settings для UI и MSW (единый localStorage). */
export function readAppSettings(): AppSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_APP_SETTINGS }
  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_APP_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      locale:
        parsed.locale === 'ru' || parsed.locale === 'de' || parsed.locale === 'en'
          ? parsed.locale
          : DEFAULT_APP_SETTINGS.locale,
      tableDensity:
        parsed.tableDensity === 'compact' ? 'compact' : 'comfortable',
      networkSimulation: Boolean(parsed.networkSimulation),
    }
  } catch {
    return { ...DEFAULT_APP_SETTINGS }
  }
}

export function writeAppSettings(next: AppSettings) {
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(next))
}
