import type { App } from 'vue'
import type { I18n, I18nOptions } from 'vue-i18n'

import { localeSetting } from '@admin/setting'
import { createI18n } from 'vue-i18n'
import { setHtmlPageLang, setLoadLocalePool } from './helper'
import { getLocale } from './store'

const { fallback, availableLocales } = localeSetting

export let i18n: ReturnType<typeof createI18n>

const createI18nOptions = async (): Promise<I18nOptions> => {
  const locale = getLocale.value
  const defaultLocal = await import(`./lang/${locale}.ts`)
  const message = defaultLocal.default?.message ?? {}

  setHtmlPageLang(locale)

  setLoadLocalePool((loadLocalePool) => loadLocalePool.push(locale))

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      [locale]: message,
    },
    availableLocales: availableLocales,
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  }
}

// setup i18n instance with glob
export const setupI18n = async (app: App) => {
  const options = await createI18nOptions()
  i18n = createI18n(options) as I18n
  app.use(i18n)
}
