import { diff } from '@vben-core/toolkit';

import { computed } from 'vue';

import { isDarkTheme, preferencesManager } from './preferences';

function usePreferences() {
  const preferences = preferencesManager.getPreferences();
  const flatPreferences = preferencesManager.getFlatPreferences();
  const initialPreferences = preferencesManager.getInitialPreferences();
  /**
   * @zh_CN 计算偏好设置的变化
   */
  const diffPreference = computed(() => {
    return diff(initialPreferences, preferences);
  });

  /**
   * @zh_CN 判断是否为暗黑模式
   * @param  preferences - 当前偏好设置对象，它的主题值将被用来判断是否为暗黑模式。
   * @returns 如果主题为暗黑模式，返回 true，否则返回 false。
   */
  const isDark = computed(() => {
    return isDarkTheme(flatPreferences.appThemeMode);
  });

  const theme = computed(() => {
    return isDark.value ? 'dark' : 'light';
  });

  /**
   * @zh_CN 布局方式
   */
  const layout = computed(() =>
    flatPreferences.appIsMobile ? 'side-nav' : flatPreferences.appLayout,
  );

  /**
   * @zh_CN 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const isFullContent = computed(
    () => flatPreferences.appLayout === 'full-content',
  );

  /**
   * @zh_CN 是否侧边导航模式
   */
  const isSideNav = computed(() => flatPreferences.appLayout === 'side-nav');

  /**
   * @zh_CN 是否侧边混合模式
   */
  const isSideMixedNav = computed(
    () => flatPreferences.appLayout === 'side-mixed-nav',
  );

  /**
   * @zh_CN 是否为头部导航模式
   */
  const isHeaderNav = computed(
    () => flatPreferences.appLayout === 'header-nav',
  );

  /**
   * @zh_CN 是否为混合导航模式
   */
  const isMixedNav = computed(() => flatPreferences.appLayout === 'mixed-nav');

  /**
   * @zh_CN 是否包含侧边导航模式
   */
  const isSideMode = computed(() => {
    return isMixedNav.value || isSideMixedNav.value || isSideNav.value;
  });

  /**
   * @zh_CN 是否开启keep-alive
   * 在tabs可见以及开启keep-alive的情况下才开启
   */
  const keepAlive = computed(
    () => flatPreferences.tabbarKeepAlive && flatPreferences.tabbarEnable,
  );

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelLeft = computed(() => {
    return flatPreferences.appAuthPageLayout === 'panel-left';
  });

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelRight = computed(() => {
    return flatPreferences.appAuthPageLayout === 'panel-right';
  });

  /**
   * @zh_CN 登录注册页面布局是否为中间
   */
  const authPanelCenter = computed(() => {
    return flatPreferences.appAuthPageLayout === 'panel-center';
  });

  return {
    authPanelCenter,
    authPanelLeft,
    authPanelRight,
    diffPreference,
    isDark,
    isFullContent,
    isHeaderNav,
    isMixedNav,
    isSideMixedNav,
    isSideMode,
    isSideNav,
    keepAlive,
    layout,
    theme,
  };
}

export { usePreferences };
