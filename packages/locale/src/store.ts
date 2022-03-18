import type { LocaleType } from '@pkg/types'

import { computed } from 'vue'
import { LOCALE_KEY } from '@pkg/tokens'
import { useLocalStorage } from '@vueuse/core'
import { localeSetting } from '@pkg/setting'

const store = useLocalStorage(LOCALE_KEY, localeSetting)

export const setLocale = (locale: LocaleType) => {
  store.value.locale = locale
}

export const getLocale = computed(() => store.value.locale)

export const showLocalePicker = computed(() => store.value.showPicker)
