import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { useUserStore } from '@/store/user'
import { useTabs } from './useTabs'
import { router, resetRouter } from '@/router'
import { PermissionModeEnum, RoleEnum } from '@admin/tokens'
import { isArray, intersection } from '@admin/utils'
import { useMultipleTabStore } from '@/store/multipleTab'
import { projectSetting } from '@admin/setting'

// User permissions related operations
export function usePermission() {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()
  const { closeAll } = useTabs(router)

  /**
   * Change permission mode
   */
  async function togglePermissionMode() {
    appStore.setProjectConfig({
      permissionMode:
        projectSetting.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROUTE_MAPPING
          : PermissionModeEnum.BACK,
    })
    location.reload()
  }

  /**
   * Reset and regain authority resource information
   * @param id
   */
  async function resume() {
    const tabStore = useMultipleTabStore()
    tabStore.clearCacheTabs()
    resetRouter()
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach((route) => {
      router.addRoute(route)
    })
    permissionStore.setLastBuildMenuTime()
    closeAll()
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(
    value?: RoleEnum | RoleEnum[] | string | string[],
    def = true,
  ): boolean {
    // Visible by default
    if (!value) {
      return def
    }

    const permMode = projectSetting.permissionMode

    if (
      [PermissionModeEnum.ROUTE_MAPPING, PermissionModeEnum.ROLE].includes(
        permMode,
      )
    ) {
      if (!isArray(value)) {
        return userStore.getRoleList?.includes(value as RoleEnum)
      }
      return (
        (intersection(value, userStore.getRoleList) as RoleEnum[]).length > 0
      )
    }

    if (PermissionModeEnum.BACK === permMode) {
      const allCodeList = permissionStore.getPermCodeList as string[]
      if (!isArray(value)) {
        return allCodeList.includes(value)
      }
      return (intersection(value, allCodeList) as string[]).length > 0
    }
    return true
  }

  /**
   * Change roles
   * @param roles
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
      throw new Error(
        'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!',
      )
    }

    if (!isArray(roles)) {
      roles = [roles]
    }
    userStore.setRoleList(roles)
    await resume()
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    resume()
  }

  return { changeRole, hasPermission, togglePermissionMode, refreshMenu }
}
