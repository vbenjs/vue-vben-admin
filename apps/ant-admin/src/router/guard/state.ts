import type { Router } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useMultipleTabStore } from '@/store/multiple-tab'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { PageEnum } from '@pkg/tokens'
import { removeTabChangeListener } from '@/logics/mitt/route-change'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      const tabStore = useMultipleTabStore()
      const userStore = useUserStore()
      const appStore = useAppStore()
      const permissionStore = usePermissionStore()
      appStore.resetAllState()
      permissionStore.resetState()
      tabStore.resetState()
      userStore.resetState()
      removeTabChangeListener()
    }
  })
}
