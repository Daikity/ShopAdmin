import { beforeEach, describe, expect, it } from 'vitest'
import { i18n } from './index'

describe('i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('переключает языки и отдаёт ключи', async () => {
    expect(i18n.t('nav.dashboard')).toBe('Dashboard')

    await i18n.changeLanguage('ru')
    expect(i18n.t('nav.dashboard')).toBe('Дашборд')

    await i18n.changeLanguage('de')
    expect(i18n.t('nav.dashboard')).toBe('Dashboard')
    expect(i18n.t('auth.submit')).toBe('Anmelden')
  })

  it('имеет одинаковую структуру ключей en/ru/de', () => {
    const enKeys = Object.keys(i18n.getResourceBundle('en', 'translation') as object)
    const ruKeys = Object.keys(i18n.getResourceBundle('ru', 'translation') as object)
    const deKeys = Object.keys(i18n.getResourceBundle('de', 'translation') as object)

    expect(ruKeys.sort()).toEqual(enKeys.sort())
    expect(deKeys.sort()).toEqual(enKeys.sort())
  })
})
