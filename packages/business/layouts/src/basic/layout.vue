<script lang="ts" setup>
import { computed } from 'vue';

import { PreferencesWidget } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { VbenAdminLayout } from '@vben-core/layout-ui';
import {
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

  const { isMobile } = preferences.app;
  const { collapse } = preferences.sidebar;

  if (!collapse && isMobile) {
    return false;
  }
  return collapse || isSideMixedNav.value;
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
    :content-compact="preferences.app.contentCompact"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :header-hidden="preferences.header.hidden"
    :header-mode="preferences.header.mode"
    :header-visible="preferences.header.enable"
    :is-mobile="preferences.app.isMobile"
    :layout="layout"
    :side-collapse="preferences.sidebar.collapse"
    :side-collapse-show-title="preferences.sidebar.collapseShowTitle"
    :side-expand-on-hover="preferences.sidebar.expandOnHover"
    :side-extra-collapse="preferences.sidebar.extraCollapse"
    :side-hidden="preferences.sidebar.hidden"
    :side-semi-dark="preferences.app.semiDarkMenu"
    :side-theme="theme"
    :side-visible="sideVisible"
    :side-width="preferences.sidebar.width"
    :tabs-visible="preferences.tabbar.enable"
    @side-mouse-leave="handleSideMouseLeave"
    @update:side-collapse="
      (value: boolean) => updatePreferences({ sidebar: { collapse: value } })
    "
    @update:side-expand-on-hover="
      (value: boolean) =>
        updatePreferences({ sidebar: { expandOnHover: value } })
    "
    @update:side-extra-collapse="
      (value: boolean) =>
        updatePreferences({ sidebar: { extraCollapse: value } })
    "
    @update:side-visible="
      (value: boolean) => updatePreferences({ sidebar: { enable: value } })
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
        :alt="preferences.app.name"
        :class="logoClass"
        :collapse="logoCollapse"
        :src="preferences.logo.source"
        :text="preferences.app.name"
        :theme="showHeaderNav ? headerMenuTheme : theme"
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
            :show-home="preferences.breadcrumb.showHome"
            :show-icon="preferences.breadcrumb.showIcon"
            :type="preferences.breadcrumb.styleType"
          />
        </template>
        <template v-if="showHeaderNav" #menu>
          <LayoutMenu
            :default-active="headerActive"
            :menus="wrapperMenus(headerMenus)"
            :rounded="isMenuRounded"
            :theme="headerMenuTheme"
            class="w-full"
            mode="horizontal"
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
        :accordion="preferences.navigation.accordion"
        :collapse="preferences.sidebar.collapse"
        :collapse-show-title="preferences.sidebar.collapseShowTitle"
        :default-active="sideActive"
        :menus="wrapperMenus(sideMenus)"
        :rounded="isMenuRounded"
        :theme="theme"
        mode="vertical"
        @select="handleMenuSelect"
      />
    </template>
    <template #mixed-menu>
      <LayoutMixedMenu
        :active-path="extraActiveMenu"
        :collapse="!preferences.sidebar.collapseShowTitle"
        :rounded="isMenuRounded"
        :theme="theme"
        @default-select="handleDefaultSelect"
        @enter="handleMenuMouseEnter"
        @select="handleMixedMenuSelect"
      />
    </template>
    <!-- 侧边额外区域 -->
    <template #side-extra>
      <LayoutExtraMenu
        :accordion="preferences.navigation.accordion"
        :collapse="preferences.sidebar.extraCollapse"
        :menus="wrapperMenus(extraMenus)"
        :rounded="isMenuRounded"
        :theme="theme"
      />
    </template>
    <template #side-extra-title>
      <VbenLogo
        v-if="preferences.logo.enable"
        :alt="preferences.app.name"
        :text="preferences.app.name"
        :theme="theme"
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
