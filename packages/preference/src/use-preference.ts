import { diff } from '@vben-core/toolkit';

import { computed } from 'vue';

import {
  initialPreference,
  isDarkTheme,
  currentPreference as preference,
} from './preference';

function usePreference() {
  /**
   * @zh_CN 计算偏好设置的变化
   */
  const diffPreference = computed(() => {
    return diff(initialPreference.value, preference);
  });

  /**
   * @zh_CN 判断是否为暗黑模式
   * @param  preference - 当前偏好设置对象，它的主题值将被用来判断是否为暗黑模式。
   * @returns 如果主题为暗黑模式，返回 true，否则返回 false。
   */
  const isDark = computed(() => {
    const theme = preference.theme;
    return isDarkTheme(theme);
  });

  const theme = computed(() => {
    return isDark.value ? 'dark' : 'light';
  });

  /**
   * @zh_CN 布局方式
   */
  const layout = computed(() =>
    preference.isMobile ? 'side-nav' : preference.layout,
  );

  /**
   * @zh_CN 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const isFullContent = computed(() => preference.layout === 'full-content');

  /**
   * @zh_CN 是否侧边导航模式
   */
  const isSideNav = computed(() => preference.layout === 'side-nav');

  /**
   * @zh_CN 是否侧边混合模式
   */
  const isSideMixedNav = computed(() => preference.layout === 'side-mixed-nav');

  /**
   * @zh_CN 是否为头部导航模式
   */
  const isHeaderNav = computed(() => preference.layout === 'header-nav');

  /**
   * @zh_CN 是否为混合导航模式
   */
  const isMixedNav = computed(() => preference.layout === 'mixed-nav');

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
    () => preference.keepAlive && preference.tabsVisible,
  );

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelLeft = computed(() => {
    return preference.authPageLayout === 'panel-left';
  });

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelRight = computed(() => {
    return preference.authPageLayout === 'panel-right';
  });

  /**
   * @zh_CN 登录注册页面布局是否为中间
   */
  const authPanelCenter = computed(() => {
    return preference.authPageLayout === 'panel-center';
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

export { usePreference };
