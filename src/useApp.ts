// Application related functions
import type { ProjectConfig } from '/@/types/config';
import type { App } from 'vue';
import { computed, ref } from 'vue';

import { ThemeModeEnum } from '/@/enums/appEnum';
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';

import projectSetting from '/@/settings/projectSetting';
import { getLocal } from '/@/utils/helper/persistent';
import { isUnDef, isNull } from '/@/utils/is';
import { updateGrayMode, updateColorWeak } from '/@/setup/theme';

import { appStore } from '/@/store/modules/app';
import { useNetWork } from '/@/hooks/web/useNetWork';
import { useRouter } from 'vue-router';
import { PageEnum } from '/@/enums/pageEnum';
import { useTimeout } from '/@/hooks/core/useTimeout';
import { ExceptionEnum } from '/@/enums/exceptionEnum';

let app: App;
export function setApp(_app: App): void {
  app = _app;
}

export function getApp(): App {
  return app;
}

// TODO 主题切换
export function useThemeMode(mode: ThemeModeEnum) {
  const modeRef = ref(mode);
  const html = document.documentElement;
  const clsList = html.classList;

  const change = () => {
    clsList.contains(mode) ? clsList.remove(mode) : clsList.add(mode);
  };
  return {
    runChangeThemeMode: change,
    mode: computed(() => modeRef.value),
  };
}

// Initial project configuration
export function useInitAppConfigStore() {
  let projCfg: ProjectConfig = getLocal(PROJ_CFG_KEY) as ProjectConfig;
  if (!projCfg) {
    projCfg = projectSetting;
  }
  const { colorWeak, grayMode } = projCfg;
  try {
    // if (
    //   themeColor !== primaryColor &&
    //   themeColor &&
    //   process.env.VUE_APP_USE_THEME_REPLACER !== 'TRUE'
    // ) {
    //   updateTheme(themeColor);
    // }
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.commitProjectConfigState(projCfg);
}

// Config Provider
export function useConfigProvider() {
  function transformCellText({ text }: { text: string }) {
    if (isNull(text) || isUnDef(text)) {
      return ' - ';
    }
    return text;
  }
  return {
    transformCellText,
  };
}

// Initialize network monitoring
export function useListenerNetWork() {
  const { listenNetWork } = appStore.getProjectConfig;
  if (!listenNetWork) return;
  const { replace } = useRouter();
  // Check network status
  useNetWork({
    onLineFn: () => {
      replace(PageEnum.BASE_HOME);
      useTimeout(() => {
        appStore.commitPageLoadingState(false);
      }, 300);
    },
    offLineFn: () => {
      replace({
        path: PageEnum.ERROR_PAGE,
        query: {
          status: String(ExceptionEnum.NET_WORK_ERROR),
        },
      });
    },
  });
}
