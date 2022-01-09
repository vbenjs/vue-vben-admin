import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { watch, unref } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle as _useTitle } from '@vueuse/core'
import { useI18n, useLocale } from '@admin/locale'

/**
 * Listening to page changes and dynamically changing site titles
 */
export const useTitle = (
  title: string,
  preventHandler: (
    route: RouteLocationNormalizedLoaded,
  ) => Promise<boolean> | boolean,
) => {
  const { t } = useI18n()
  const { currentRoute } = useRouter()

  const pageTitle = _useTitle()
  const { getLocale } = useLocale()

  watch(
    [() => currentRoute.value.path, () => getLocale.value],
    async () => {
      const route = unref(currentRoute)

      if (!preventHandler(route)) {
        return
      }

      const tTitle = t(route?.meta?.title as string)
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`
    },
    { immediate: true },
  )
}
