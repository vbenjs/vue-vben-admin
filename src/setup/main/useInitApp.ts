import { appStore } from '@/store/modules/app';
import { PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { ProjectConfig } from '@/types/config';
import projectSetting from '@/settings/projectSetting';
import { primaryColor } from 'config/glob/lessModifyVars';
import { updateTheme, updateGrayMode, updateColorWeak } from '@/setup/theme/index';

import { getLocal } from '@/store/persistent';
/**
 * @description: 设置初始项目配置vuex
 */
export function useInitProjCfg() {
  let projCfg: ProjectConfig = getLocal(PROJ_CFG_KEY) as ProjectConfig;
  if (!projCfg) {
    projCfg = projectSetting;
  }
  const { themeColor, colorWeak, grayMode } = projCfg;
  try {
    if (
      themeColor !== primaryColor &&
      themeColor &&
      process.env.VUE_APP_USE_THEME_REPLACER !== 'TRUE'
    ) {
      updateTheme(themeColor);
    }
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }

  appStore.commitProjCfgState(projCfg);
}
