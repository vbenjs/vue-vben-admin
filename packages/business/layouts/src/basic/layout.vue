<script lang="ts" setup>
import { computed } from 'vue';

import { PreferencesWidget } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { VbenAdminLayout } from '@vben-core/layout-ui';
import {
  flatPreferences,
  preferences,
  updatePreferences,
  usePreferences,
} from '@vben-core/preferences';
import {
  VbenBackTop,
  // VbenFloatingButtonGroup,
  VbenLogo,
} from '@vben-core/shadcn-ui';
import { mapTree } from '@vben-core/toolkit';
import { MenuRecordRaw } from '@vben-core/typings';

import { LayoutContent } from './content';
import { LayoutFooter } from './footer';
import { LayoutHeader } from './header';
import {
  LayoutExtraMenu,
  LayoutMenu,
  LayoutMixedMenu,
  useExtraMenu,
  useMixedMenu,
} from './menu';
import { LayoutTabs, LayoutTabsToolbar } from './tabs';
import { Breadcrumb } from './widgets';

defineOptions({ name: 'BasicLayout' });

const { isDark, isHeaderNav, isMixedNav, isSideMixedNav, layout } =
  usePreferences();

const headerMenuTheme = computed(() => {
  return isDark.value ? 'dark' : 'light';
});

const theme = computed(() => {
  const dark = isDark.value || preferences.app.semiDarkMenu;
  return dark ? 'dark' : 'light';
});

const logoClass = computed(() => {
  const { collapse, collapseShowTitle } = preferences.sidebar;
  return collapseShowTitle && collapse && !isMixedNav.value ? 'mx-auto' : '';
});

const isMenuRounded = computed(() => {
  return preferences.navigation.styleType === 'rounded';
});

const logoCollapse = computed(() => {
  if (isHeaderNav.value || isMixedNav.value) {
    return false;
  }

  const { appIsMobile, sidebarCollapse } = flatPreferences;

  if (!sidebarCollapse && appIsMobile) {
    return false;
  }
  return sidebarCollapse || isSideMixedNav.value;
});

const showHeaderNav = computed(() => {
  return isHeaderNav.value || isMixedNav.value;
});

const {
  extraActiveMenu,
  extraMenus,
  extraVisible,
  handleDefaultSelect,
  handleMenuMouseEnter,
  handleMixedMenuSelect,
  handleSideMouseLeave,
} = useExtraMenu();

const {
  handleMenuSelect,
  headerActive,
  headerMenus,
  sideActive,
  sideMenus,
  sideVisible,
} = useMixedMenu();

function wrapperMenus(menus: MenuRecordRaw[]) {
  return mapTree(menus, (item) => {
    return {
      ...item,
      name: $t(item.name),
    };
  });
}
</script>

<template>
  <VbenAdminLayout
    v-model:side-extra-visible="extraVisible"
    v-model:side-collapse="flatPreferences.sidebarCollapse"
    v-model:side-expand-on-hover="flatPreferences.sidebarExpandOnHover"
    v-model:side-extra-collapse="flatPreferences.sidebarExtraCollapse"
    :side-collapse-show-title="preferences.sidebar.collapseShowTitle"
    :content-compact="preferences.app.contentCompact"
    :is-mobile="preferences.app.isMobile"
    :layout="layout"
    :header-mode="preferences.header.mode"
    :footer-fixed="preferences.footer.fixed"
    :side-semi-dark="preferences.app.semiDarkMenu"
    :side-theme="theme"
    :side-hidden="preferences.sidebar.hidden"
    :side-visible="sideVisible"
    :footer-visible="preferences.footer.enable"
    :header-visible="preferences.header.enable"
    :header-hidden="preferences.header.hidden"
    :side-width="preferences.sidebar.width"
    :tabs-visible="preferences.tabbar.enable"
    @side-mouse-leave="handleSideMouseLeave"
    @update:side-visible="
      (value: boolean) =>
        updatePreferences({
          sidebar: {
            enable: value,
          },
        })
    "
  >
    <template v-if="preferences.app.showPreference" #preferences>
      <PreferencesWidget />
    </template>

    <template #floating-button-group>
      <VbenBackTop />
      <!-- <VbenFloatingButtonGroup /> -->
    </template>

    <!-- logo -->
    <template #logo>
      <VbenLogo
        :collapse="logoCollapse"
        :src="preferences.logo.source"
        :text="preferences.app.name"
        :theme="showHeaderNav ? headerMenuTheme : theme"
        :alt="preferences.app.name"
        :class="logoClass"
      />
    </template>
    <!-- 头部区域 -->
    <template #header>
      <LayoutHeader :theme="theme">
        <template
          v-if="!showHeaderNav && preferences.breadcrumb.enable"
          #breadcrumb
        >
          <Breadcrumb
            :hide-when-only-one="preferences.breadcrumb.hideOnlyOne"
            :type="preferences.breadcrumb.styleType"
            :show-icon="preferences.breadcrumb.showIcon"
            :show-home="preferences.breadcrumb.showHome"
          />
        </template>
        <template v-if="showHeaderNav" #menu>
          <LayoutMenu
            class="w-full"
            :rounded="isMenuRounded"
            mode="horizontal"
            :theme="headerMenuTheme"
            :menus="wrapperMenus(headerMenus)"
            :default-active="headerActive"
            @select="handleMenuSelect"
          />
        </template>
        <template #user-dropdown>
          <slot name="user-dropdown"></slot>
        </template>
        <template #notification>
          <slot name="notification"></slot>
        </template>
      </LayoutHeader>
    </template>
    <!-- 侧边菜单区域 -->
    <template #menu>
      <LayoutMenu
        mode="vertical"
        :accordion="preferences.navigation.accordion"
        :rounded="isMenuRounded"
        :collapse-show-title="preferences.sidebar.collapseShowTitle"
        :collapse="preferences.sidebar.collapse"
        :theme="theme"
        :menus="wrapperMenus(sideMenus)"
        :default-active="sideActive"
        @select="handleMenuSelect"
      />
    </template>
    <template #mixed-menu>
      <LayoutMixedMenu
        :rounded="isMenuRounded"
        :collapse="!preferences.sidebar.collapseShowTitle"
        :active-path="extraActiveMenu"
        :theme="theme"
        @select="handleMixedMenuSelect"
        @default-select="handleDefaultSelect"
        @enter="handleMenuMouseEnter"
      />
    </template>
    <!-- 侧边额外区域 -->
    <template #side-extra>
      <LayoutExtraMenu
        :accordion="preferences.navigation.accordion"
        :rounded="isMenuRounded"
        :menus="wrapperMenus(extraMenus)"
        :collapse="preferences.sidebar.extraCollapse"
        :theme="theme"
      />
    </template>
    <template #side-extra-title>
      <VbenLogo
        v-if="preferences.logo.enable"
        :text="preferences.app.name"
        :theme="theme"
        :alt="preferences.app.name"
      />
    </template>

    <template #tabs>
      <LayoutTabs
        v-if="preferences.tabbar.enable"
        :show-icon="preferences.tabbar.showIcon"
      />
    </template>
    <template #tabs-toolbar>
      <LayoutTabsToolbar v-if="preferences.tabbar.enable" />
    </template>

    <!-- 主体内容 -->
    <template #content>
      <LayoutContent />
    </template>
    <!-- 页脚 -->
    <template v-if="preferences.footer.enable" #footer>
      <LayoutFooter v-if="preferences.app.copyright">
        {{ preferences.app.copyright }}
      </LayoutFooter>
    </template>
  </VbenAdminLayout>
</template>
