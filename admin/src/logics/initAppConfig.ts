/**
 * Application configuration
 */
import type { ProjectConfig } from '@vben-admin/types'

import { PROJ_CFG_KEY } from '@vben-admin/tokens'
import { projectSetting, primaryColor } from '@vben-admin/setting'

import {
  updateHeaderBgColor,
  updateSidebarBgColor,
} from '/@/logics/theme/updateBackground'
import { updateColorWeak } from '/@/logics/theme/updateColorWeak'
import { updateGrayMode } from '/@/logics/theme/updateGrayMode'
import { updateDarkTheme } from '/@/logics/theme/dark'
import { changeTheme } from '/@/logics/theme'
import { useAppStore } from '/@/store/modules/app'
import { getCommonStoragePrefix, getStorageShortName } from '/@/internal/env'
import { Persistent } from '/@/utils/cache/persistent'
import { deepMerge } from '@vben-admin/utils'
import { ThemeEnum } from '@vben-admin/tokens'

// Initial project configuration
export function initAppConfigStore() {
  const appStore = useAppStore()
  let projCfg: ProjectConfig = Persistent.getLocal(
    PROJ_CFG_KEY,
  ) as ProjectConfig
  projCfg = deepMerge(projectSetting, projCfg || {})
  const darkMode = appStore.getDarkMode
  const {
    colorWeak,
    grayMode,
    themeColor,

    headerSetting: { bgColor: headerBgColor } = {},
    menuSetting: { bgColor } = {},
  } = projCfg
  try {
    if (themeColor && themeColor !== primaryColor) {
      changeTheme(themeColor)
    }

    grayMode && updateGrayMode(grayMode)
    colorWeak && updateColorWeak(colorWeak)
  } catch (error) {
    console.log(error)
  }
  appStore.setProjectConfig(projCfg)

  // init dark mode
  updateDarkTheme(darkMode)
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor()
    updateSidebarBgColor()
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor)
    bgColor && updateSidebarBgColor(bgColor)
  }

  setTimeout(() => {
    clearObsoleteStorage()
  }, 16)
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix()
  const shortPrefix = getStorageShortName()

  ;[localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key)
      }
    })
  })
}
