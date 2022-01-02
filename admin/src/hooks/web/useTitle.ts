import { watch, unref } from 'vue'
import { useI18n } from '@vben-admin/locale'
import { useTitle as usePageTitle } from '@vueuse/core'
import { getGlobalConfig } from '/@/internal'
import { useRouter } from 'vue-router'
import { REDIRECT_NAME } from '/@/router/constant'
import { useLocale } from '@vben-admin/locale'

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { title } = getGlobalConfig()
  const { t } = useI18n()
  const { currentRoute } = useRouter()

  const pageTitle = usePageTitle()
  const { getLocale } = useLocale()

  watch(
    [() => currentRoute.value.path, () => getLocale.value],
    () => {
      const route = unref(currentRoute)

      if (route.name === REDIRECT_NAME) {
        return
      }

      const tTitle = t(route?.meta?.title as string)
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`
    },
    { immediate: true },
  )
}
