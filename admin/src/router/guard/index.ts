import type { Router, RouteLocationNormalized } from 'vue-router'

import { useAppStoreWithOut } from '@/store/app'
import { useUserStoreWithOut } from '@/store/user'
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting'
import { RequestCanceler } from '@vben-admin/service'
import { Modal, notification } from 'ant-design-vue'
import { warn } from '@vben-admin/utils'
import { unref } from 'vue'
import { setRouteChange } from '@/logics/mitt/routeChange'
import { createPermissionGuard } from './permissionGuard'
import { createStateGuard } from './stateGuard'
import { projectSetting } from '@vben-admin/setting'
import { createParamMenuGuard } from './paramMenuGuard'
import nProgress from 'nprogress'

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createHttpGuard(router)
  createScrollGuard(router)
  createMessageGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createParamMenuGuard(router) // must after createPermissionGuard (menu has been built.)
  createStateGuard(router)
}

/**
 * Hooks for handling page state
 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(async (to) => {
    // The page has already been loaded, it will be faster to open it again, you don’t need to do loading and other processing
    to.meta.loaded = !!loadedPageMap.get(to.path)
    // Notify routing changes
    setRouteChange(to)

    return true
  })

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true)
  })
}

// Used to handle page loading status
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const appStore = useAppStoreWithOut()
  const { getOpenPageLoading } = useTransitionSetting()
  router.beforeEach(async (to) => {
    if (!userStore.getToken) {
      return true
    }
    if (to.meta.loaded) {
      return true
    }

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true)
      return true
    }
    return true
  })
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      // TODO Looking for a better way
      // The timer simulates the loading time to prevent flashing too fast,
      setTimeout(() => {
        appStore.setPageLoading(false)
      }, 220)
    }
    return true
  })
}

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting
  let requestCanceler: Nullable<RequestCanceler>
  if (removeAllHttpPending) {
    requestCanceler = new RequestCanceler()
  }
  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    requestCanceler?.removeAllPending()
    return true
  })
}

// Routing switch back to the top
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href)
  }

  const body = document.body

  router.afterEach(async (to) => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) &&
      body.scrollTo(0, 0)
    return true
  })
}

/**
 * Used to close the message instance when the route is switched
 * @param router
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll()
        notification.destroy()
      }
    } catch (error) {
      warn('message guard error:' + error)
    }
    return true
  })
}

export function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting()
  router.beforeEach(async (to) => {
    if (to.meta.loaded) {
      return true
    }
    unref(getOpenNProgress) && nProgress.start()
    return true
  })

  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done()
    return true
  })
}
