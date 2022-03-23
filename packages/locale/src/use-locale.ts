/**
 * Multi-language related operations
 */
import type { LocaleType } from '@pkg/types'

import { unref } from 'vue'
import { i18n } from './setup-i18n'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { getLocale, setLocale, showLocalePicker } from './store'

interface LangModule {
  message: Recordable
  dateLocale: Recordable
  dateLocaleName: string
}

function setI18nLanguage(locale: LocaleType) {
  ;(i18n.global.locale as any).value = locale
  setLocale(locale)
  setHtmlPageLang(locale)
}

export const useLocale = () => {
  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  const changeLocale = async (locale: LocaleType) => {
    const globalI18n = i18n.global
    const currentLocale = unref(globalI18n.locale)

    if (currentLocale === locale) {
      return locale
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale)
      return locale
    }

    const langModule = ((await import(`./lang/${locale}.ts`)) as any)
      .default as LangModule

    if (!langModule) {
      return
    }

    const { message } = langModule

    globalI18n.setLocaleMessage(locale, message)
    loadLocalePool.push(locale)

    setI18nLanguage(locale)
    return locale
  }

  return {
    getLocale,
    showLocalePicker,
    changeLocale,
  }
}
