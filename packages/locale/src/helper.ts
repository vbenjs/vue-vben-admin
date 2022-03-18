import type { LocaleType } from '@pkg/types'

import { set } from '@pkg/utils'

export const loadLocalePool: LocaleType[] = []

export const setHtmlPageLang = (locale: LocaleType) => {
  document.querySelector('html')?.setAttribute('lang', locale)
}

export const setLoadLocalePool = (
  cb: (loadLocalePool: LocaleType[]) => void,
) => {
  cb(loadLocalePool)
}

export const genMessage = (
  langs: Record<string, Record<string, any>>,
  prefix = 'lang',
) => {
  const obj: Recordable = {}

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    const lastIndex = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, lastIndex)
    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')

    if (moduleName) {
      if (objKey) {
        set(obj, moduleName, obj[moduleName] || {})
        set(obj[moduleName], objKey, langFileModule)
      } else {
        set(obj, moduleName, langFileModule || {})
      }
    }
  })
  return obj
}
