import type { LocaleType } from '@vben-admin/types'

import { LOCALE_KEY } from '@vben-admin/tokens'
import { useLocalStorage } from '@vben-admin/hooks'
import { computed } from 'vue'
import { localeSetting } from '../config'

const store = useLocalStorage(LOCALE_KEY, localeSetting)

export const setLocale = (locale: LocaleType) => {
  store.value.locale = locale
}

export const getLocale = computed(() => store.value.locale)

export const showLocalePicker = computed(() => store.value.showPicker)
