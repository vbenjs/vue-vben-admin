import { computed, toRaw, unref } from 'vue'
import { useMultipleTabStore } from '@/store/multipleTab'
import { uniqBy } from '@admin/utils'
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting'
import { useRouter } from 'vue-router'

export function useFrameKeepAlive() {
  const router = useRouter()
  const { currentRoute } = router
  const { getShowMultipleTab } = useMultipleTabSetting()
  const tabStore = useMultipleTabStore()
  const getFramePages = computed(() => {
    const ret =
      getAllFramePages(toRaw(router.getRoutes()) as RouteRecordItem[]) || []
    return ret
  })

  const getOpenTabList = computed((): string[] => {
    return tabStore.getTabList.reduce((prev: string[], next) => {
      if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
        prev.push(next.name as string)
      }
      return prev
    }, [])
  })

  function getAllFramePages(routes: RouteRecordItem[]): RouteRecordItem[] {
    let res: RouteRecordItem[] = []
    for (const route of routes) {
      const { meta: { frameSrc } = {}, children } = route
      if (frameSrc) {
        res.push(route)
      }
      if (children && children.length) {
        res.push(...getAllFramePages(children))
      }
    }
    res = uniqBy(res, 'name')
    return res
  }

  function showIframe(item: RouteRecordItem) {
    return item.name === unref(currentRoute).name
  }

  function hasRenderFrame(name: string) {
    if (!unref(getShowMultipleTab)) {
      return router.currentRoute.value.name === name
    }
    return unref(getOpenTabList).includes(name)
  }

  return { hasRenderFrame, getFramePages, showIframe, getAllFramePages }
}
