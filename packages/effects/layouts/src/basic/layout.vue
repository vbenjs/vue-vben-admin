<script lang="ts" setup>
import { computed } from 'vue';

import { VbenAdminLayout } from '@vben-core/layout-ui';
import { $t } from '@vben-core/locales';
import {
  preferences,
  updatePreferences,
  usePreferences,
} from '@vben-core/preferences';
import { VbenBackTop, VbenLogo } from '@vben-core/shadcn-ui';
import { mapTree } from '@vben-core/toolkit';
import { MenuRecordRaw } from '@vben-core/typings';

import { Breadcrumb, CozeAssistant, Preferences } from '../widgets';
import { LayoutContent } from './content';
import { Copyright } from './copyright';
import { LayoutFooter } from './footer';
import { LayoutHeader } from './header';
import {
  LayoutExtraMenu,
  LayoutMenu,
  LayoutMixedMenu,
  useExtraMenu,
  useMixedMenu,
} from './menu';
import { LayoutTabbar } from './tabbar';

defineOptions({ name: 'BasicLayout' });

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const { isDark, isHeaderNav, isMixedNav, isSideMixedNav, layout } =
  usePreferences();

const headerMenuTheme = computed(() => {
  return isDark.value ? 'dark' : 'light';
});

const theme = computed(() => {
  const dark = isDark.value || preferences.theme.semiDarkMenu;
  return dark ? 'dark' : 'light';
});

const logoClass = computed(() => {
  let cls = '';
  const { collapsed, collapsedShowTitle } = preferences.sidebar;
  if (collapsedShowTitle && collapsed && !isMixedNav.value) {
    cls += ' mx-auto';
  }
  if (isSideMixedNav.value) {
    cls += ' flex-center';
  }
  return cls;
});

const isMenuRounded = computed(() => {
  return preferences.navigation.styleType === 'rounded';
});

const logoCollapse = computed(() => {
  if (isHeaderNav.value || isMixedNav.value) {
    return false;
  }

  const { isMobile } = preferences.app;
  const { collapsed } = preferences.sidebar;

  if (!collapsed && isMobile) {
    return false;
  }
  return collapsed || isSideMixedNav.value;
});

const showHeaderNav = computed(() => {
  return isHeaderNav.value || isMixedNav.value;
});

const {
  extraActiveMenu,
  extraMenus,
  handleDefaultSelect,
  handleMenuMouseEnter,
  handleMixedMenuSelect,
  handleSideMouseLeave,
  sidebarExtraVisible,
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
    return { ...item, name: $t(item.name) };
  });
}

function toggleSidebar() {
  updatePreferences({
    sidebar: {
      hidden: !preferences.sidebar.hidden,
    },
  });
}

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <VbenAdminLayout
    v-model:sidebar-extra-visible="sidebarExtraVisible"
    :content-compact="preferences.app.contentCompact"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :header-hidden="preferences.header.hidden"
    :header-mode="preferences.header.mode"
    :header-toggle-sidebar-button="preferences.widget.sidebarToggle"
    :header-visible="preferences.header.enable"
    :is-mobile="preferences.app.isMobile"
    :layout="layout"
    :sidebar-collapse="preferences.sidebar.collapsed"
    :sidebar-collapse-show-title="preferences.sidebar.collapsedShowTitle"
    :sidebar-enable="sideVisible"
    :sidebar-expand-on-hover="preferences.sidebar.expandOnHover"
    :sidebar-extra-collapse="preferences.sidebar.extraCollapse"
    :sidebar-hidden="preferences.sidebar.hidden"
    :sidebar-semi-dark="preferences.theme.semiDarkMenu"
    :sidebar-theme="theme"
    :sidebar-width="preferences.sidebar.width"
    :tabbar-enable="preferences.tabbar.enable"
    @side-mouse-leave="handleSideMouseLeave"
    @toggle-sidebar="toggleSidebar"
    @update:sidebar-collapse="
      (value: boolean) => updatePreferences({ sidebar: { collapsed: value } })
    "
    @update:sidebar-enable="
      (value: boolean) => updatePreferences({ sidebar: { enable: value } })
    "
    @update:sidebar-expand-on-hover="
      (value: boolean) =>
        updatePreferences({ sidebar: { expandOnHover: value } })
    "
    @update:sidebar-extra-collapse="
      (value: boolean) =>
        updatePreferences({ sidebar: { extraCollapse: value } })
    "
  >
    <template v-if="preferences.app.enablePreferences" #preferences>
      <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout" />
    </template>

    <template #floating-groups>
      <CozeAssistant
        v-if="preferences.widget.aiAssistant"
        :is-mobile="preferences.app.isMobile"
      />
      <VbenBackTop />
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
        :collapse="preferences.sidebar.collapsed"
        :collapse-show-title="preferences.sidebar.collapsedShowTitle"
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
        :collapse="!preferences.sidebar.collapsedShowTitle"
        :menus="wrapperMenus(headerMenus)"
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

    <template #tabbar>
      <LayoutTabbar
        v-if="preferences.tabbar.enable"
        :show-icon="preferences.tabbar.showIcon"
      />
    </template>

    <!-- 主体内容 -->
    <template #content>
      <LayoutContent />
    </template>
    <!-- 页脚 -->
    <template v-if="preferences.footer.enable" #footer>
      <LayoutFooter>
        <Copyright
          v-if="preferences.copyright.enable"
          v-bind="preferences.copyright"
        />
      </LayoutFooter>
    </template>

    <template #extra>
      <slot name="extra"></slot>
      <Transition v-if="preferences.widget.lockScreen" name="slide-up">
        <slot name="lock-screen"></slot>
      </Transition>
    </template>
  </VbenAdminLayout>
</template>
