<script lang="ts" setup>
import { VbenAdminLayout } from '@vben-core/layout-ui';
import {
  VbenBackTop,
  // VbenFloatingButtonGroup,
  VbenLogo,
} from '@vben-core/shadcn-ui';
import { mapTree } from '@vben-core/toolkit';
import { MenuRecordRaw } from '@vben-core/typings';

import { PreferenceWidget } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { preference, updatePreference, usePreference } from '@vben/preference';
import { computed } from 'vue';

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
  usePreference();

const headerMenuTheme = computed(() => {
  return isDark.value ? 'dark' : 'light';
});

const theme = computed(() => {
  const dark = isDark.value || preference.semiDarkMenu;
  return dark ? 'dark' : 'light';
});

const logoClass = computed(() => {
  return preference.sideCollapseShowTitle &&
    preference.sideCollapse &&
    !isMixedNav.value
    ? 'mx-auto'
    : '';
});

const isMenuRounded = computed(() => {
  return preference.navigationStyle === 'rounded';
});

const logoCollapse = computed(() => {
  if (isHeaderNav.value || isMixedNav.value) {
    return false;
  }

  const { isMobile, sideCollapse } = preference;

  if (!sideCollapse && isMobile) {
    return false;
  }
  return sideCollapse || isSideMixedNav.value;
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
    :side-collapse-show-title="preference.sideCollapseShowTitle"
    :side-collapse="preference.sideCollapse"
    :side-extra-collapse="preference.sideExtraCollapse"
    :content-compact="preference.contentCompact"
    :is-mobile="preference.isMobile"
    :layout="layout"
    :header-mode="preference.headerMode"
    :footer-fixed="preference.footerFixed"
    :side-semi-dark="preference.semiDarkMenu"
    :side-theme="theme"
    :side-hidden="preference.sideHidden"
    :side-visible="sideVisible"
    :footer-visible="preference.footerVisible"
    :header-visible="preference.headerVisible"
    :header-hidden="preference.headerHidden"
    :side-width="preference.sideWidth"
    :tabs-visible="preference.tabsVisible"
    :side-expand-on-hover="preference.sideExpandOnHover"
    @side-mouse-leave="handleSideMouseLeave"
    @update:side-collapse="
      (value: boolean) => updatePreference('sideCollapse', value)
    "
    @update:side-extra-collapse="
      (value: boolean) => updatePreference('sideExtraCollapse', value)
    "
    @update:side-visible="
      (value: boolean) => updatePreference('sideVisible', value)
    "
    @update:side-expand-on-hover="
      (value: boolean) => updatePreference('sideExpandOnHover', value)
    "
  >
    <template v-if="preference.showPreference" #preference>
      <PreferenceWidget />
    </template>

    <template #floating-button-group>
      <VbenBackTop />
      <!-- <VbenFloatingButtonGroup /> -->
    </template>

    <!-- logo -->
    <template #logo>
      <VbenLogo
        :collapse="logoCollapse"
        :src="preference.logo"
        :text="preference.appName"
        :theme="showHeaderNav ? headerMenuTheme : theme"
        :alt="preference.appName"
        :class="logoClass"
      />
    </template>
    <!-- 头部区域 -->
    <template #header>
      <LayoutHeader :theme="theme">
        <template
          v-if="!showHeaderNav && preference.breadcrumbVisible"
          #breadcrumb
        >
          <Breadcrumb
            :hide-when-only-one="preference.breadcrumbHideOnlyOne"
            :type="preference.breadcrumbStyle"
            :show-icon="preference.breadcrumbIcon"
            :show-home="preference.breadcrumbHome"
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
        :accordion="preference.navigationAccordion"
        :rounded="isMenuRounded"
        :collapse-show-title="preference.sideCollapseShowTitle"
        :collapse="preference.sideCollapse"
        :theme="theme"
        :menus="wrapperMenus(sideMenus)"
        :default-active="sideActive"
        @select="handleMenuSelect"
      />
    </template>
    <template #mixed-menu>
      <LayoutMixedMenu
        :rounded="isMenuRounded"
        :collapse="!preference.sideCollapseShowTitle"
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
        :accordion="preference.navigationAccordion"
        :rounded="isMenuRounded"
        :menus="wrapperMenus(extraMenus)"
        :collapse="preference.sideExtraCollapse"
        :theme="theme"
      />
    </template>
    <template #side-extra-title>
      <VbenLogo
        v-if="preference.logoVisible"
        :text="preference.appName"
        :theme="theme"
        :alt="preference.appName"
      />
    </template>

    <template #tabs>
      <LayoutTabs
        v-if="preference.tabsVisible"
        :show-icon="preference.tabsIcon"
      />
    </template>
    <template #tabs-toolbar>
      <LayoutTabsToolbar v-if="preference.tabsVisible" />
    </template>

    <!-- 主体内容 -->
    <template #content>
      <LayoutContent />
    </template>
    <!-- 页脚 -->
    <template v-if="preference.footerVisible" #footer>
      <LayoutFooter v-if="preference.copyright">
        {{ preference.copyright }}
      </LayoutFooter>
    </template>
  </VbenAdminLayout>
</template>
