import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { readAppSettings, type AppLocale } from '@/shared/config/appSettings'
import { de } from './locales/de'
import { en } from './locales/en'
import { ru } from './locales/ru'

export const SUPPORTED_LOCALES = ['en', 'ru', 'de'] as const

export const LOCALE_TO_INTL: Record<AppLocale, string> = {
  en: 'en-GB',
  ru: 'ru-RU',
  de: 'de-DE',
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    de: { translation: de },
  },
  lng: readAppSettings().locale,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  if (SUPPORTED_LOCALES.includes(lng as AppLocale) && typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export { i18n }
export type { TranslationSchema } from './locales/en'
