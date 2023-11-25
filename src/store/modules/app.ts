import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from '#/config';
import type { BeforeMiniState, ApiAddress } from '#/store';

import { defineStore } from 'pinia';
import { store } from '@/store';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import { theme as antdTheme } from 'ant-design-vue/es';
import { ThemeEnum } from '@/enums/appEnum';
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY, API_ADDRESS } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { darkMode } from '@/settings/designSetting';
import { resetRouter } from '@/router';
import { deepMerge } from '@/utils';
import { reactive } from 'vue';

interface AppState {
  darkMode?: ThemeEnum;
  themeConfig: ThemeConfig;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    themeConfig: {
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        colorBgContainer: '#fff',
      },
      components: {},
    },
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading;
    },
    getDarkMode(state): 'light' | 'dark' | string {
      return state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode;
    },

    getBeforeMiniInfo(state): BeforeMiniState {
      return state.beforeMiniInfo;
    },

    getProjectConfig(state): ProjectConfig {
      return state.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting;
    },
    getApiAddress() {
      return JSON.parse(localStorage.getItem(API_ADDRESS) || '{}');
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      this.setThemeConfig();
      localStorage.setItem(APP_DARK_MODE_KEY, mode);
    },

    setThemeConfig(color?: string): void {
      let themeConfig = reactive<ThemeConfig>({
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorBgContainer: '#fff',
          colorPrimary: color || (this.projectConfig ? this.projectConfig.themeColor : '#0960bd'),
        },
        components: {},
      });

      if (this.darkMode === 'dark') {
        themeConfig = {
          algorithm: antdTheme.darkAlgorithm,
          token: {
            colorBgContainer: 'rgb(36, 37, 37)',
            colorPrimary: color || (this.projectConfig ? this.projectConfig.themeColor : '#0960bd'),
          },
          components: {},
        };
      }
      this.themeConfig = themeConfig;
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config) as ProjectConfig;
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
      this.setThemeConfig(config.themeColor);
    },
    setMenuSetting(setting: Partial<MenuSetting>): void {
      this.projectConfig!.menuSetting = deepMerge(this.projectConfig!.menuSetting, setting);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },

    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
    setApiAddress(config: ApiAddress): void {
      localStorage.setItem(API_ADDRESS, JSON.stringify(config));
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
