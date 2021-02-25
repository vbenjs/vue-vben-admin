/**
 * Application configuration
 */

import type { ProjectConfig } from '/@/types/config';

import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';

import projectSetting from '/@/settings/projectSetting';
import { getLocal } from '/@/utils/cache/persistent';
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { changeTheme } from '/@/logics/theme';

import { appStore } from '/@/store/modules/app';
import { deepMerge } from '/@/utils';
import { primaryColor } from '../../build/config/themeConfig';

// Initial project configuration
export function initAppConfigStore() {
  let projCfg: ProjectConfig = getLocal(PROJ_CFG_KEY) as ProjectConfig;
  projCfg = deepMerge(projectSetting, projCfg || {});
  try {
    const {
      colorWeak,
      grayMode,
      themeColor,
      headerSetting: { bgColor: headerBgColor } = {},
      menuSetting: { bgColor } = {},
    } = projCfg;
    if (themeColor && themeColor !== primaryColor) {
      changeTheme(themeColor);
    }
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.commitProjectConfigState(projCfg);
}
