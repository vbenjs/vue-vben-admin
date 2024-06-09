<script lang="ts" setup>
import { loadLocaleMessages } from '@vben/locales';
import {
  COLOR_PRIMARY_RESETS,
  preferences,
  updatePreferences,
} from '@vben-core/preferences';

import Preferences from './preferences.vue';
</script>
<template>
  <Preferences
    :color-primary-presets="COLOR_PRIMARY_RESETS"
    :app-locale="preferences.app.locale"
    :app-layout="preferences.app.layout"
    :app-dynamic-title="preferences.app.dynamicTitle"
    :app-theme-mode="preferences.app.themeMode"
    :app-color-gray-mode="preferences.app.colorGrayMode"
    :app-color-weak-mode="preferences.app.colorWeakMode"
    :app-semi-dark-menu="preferences.app.semiDarkMenu"
    :app-content-compact="preferences.app.contentCompact"
    :transition-enable="preferences.transition.enable"
    :transition-name="preferences.transition.name"
    :transition-progress="preferences.transition.progress"
    :theme-color-primary="preferences.theme.colorPrimary"
    :sidebar-enable="preferences.sidebar.enable"
    :sidebar-collapse="preferences.sidebar.collapse"
    :sidebar-collapse-show-title="preferences.sidebar.collapseShowTitle"
    :header-enable="preferences.header.enable"
    :header-mode="preferences.header.mode"
    :breadcrumb-enable="preferences.breadcrumb.enable"
    :breadcrumb-style="preferences.breadcrumb.styleType"
    :breadcrumb-icon="preferences.breadcrumb.showIcon"
    :breadcrumb-home="preferences.breadcrumb.showHome"
    :breadcrumb-hide-only-one="preferences.breadcrumb.hideOnlyOne"
    :tabbar-enable="preferences.tabbar.enable"
    :tabbar-show-icon="preferences.tabbar.showIcon"
    :navigation-accordion="preferences.navigation.accordion"
    :navigation-style-type="preferences.navigation.styleType"
    :navigation-split="preferences.navigation.split"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :shortcut-keys-enable="preferences.shortcutKeys.enable"
    @update:app-locale="
      (val) => {
        updatePreferences({
          app: { locale: val },
        });
        loadLocaleMessages(val);
      }
    "
    @update:app-layout="
      (val) =>
        updatePreferences({
          app: { layout: val },
        })
    "
    @update:app-dynamic-title="
      (val) =>
        updatePreferences({
          app: { dynamicTitle: val },
        })
    "
    @update:app-theme-mode="
      (val) =>
        updatePreferences({
          app: { themeMode: val },
        })
    "
    @update:app-color-gray-mode="
      (val) =>
        updatePreferences({
          app: { colorGrayMode: val },
        })
    "
    @update:app-color-weak-mode="
      (val) =>
        updatePreferences({
          app: { colorWeakMode: val },
        })
    "
    @update:app-semi-dark-menu="
      (val) =>
        updatePreferences({
          app: { semiDarkMenu: val },
        })
    "
    @update:app-content-compact="
      (val) =>
        updatePreferences({
          app: { contentCompact: val },
        })
    "
    @update:transition-enable="
      (val) =>
        updatePreferences({
          transition: { enable: val },
        })
    "
    @update:transition-name="
      (val) =>
        updatePreferences({
          transition: { name: val },
        })
    "
    @update:transition-progress="
      (val) =>
        updatePreferences({
          transition: { progress: val },
        })
    "
    @update:theme-color-primary="
      (val) =>
        updatePreferences({
          theme: { colorPrimary: val },
        })
    "
    @update:sidebar-enable="
      (val) =>
        updatePreferences({
          sidebar: { enable: val },
        })
    "
    @update:sidebar-collapse="
      (val) =>
        updatePreferences({
          sidebar: { collapse: val },
        })
    "
    @update:sidebar-collapse-show-title="
      (val) =>
        updatePreferences({
          sidebar: { collapseShowTitle: val },
        })
    "
    @update:header-enable="
      (val) =>
        updatePreferences({
          header: { enable: val },
        })
    "
    @update:header-mode="
      (val) =>
        updatePreferences({
          header: { mode: val },
        })
    "
    @update:breadcrumb-enable="
      (val) =>
        updatePreferences({
          breadcrumb: { enable: val },
        })
    "
    @update:breadcrumb-style-type="
      (val) =>
        updatePreferences({
          breadcrumb: { styleType: val },
        })
    "
    @update:breadcrumb-show-icon="
      (val) =>
        updatePreferences({
          breadcrumb: { showIcon: val },
        })
    "
    @update:breadcrumb-show-home="
      (val) =>
        updatePreferences({
          breadcrumb: { showHome: val },
        })
    "
    @update:breadcrumb-hide-only-one="
      (val) =>
        updatePreferences({
          breadcrumb: { hideOnlyOne: val },
        })
    "
    @update:tabbar-enable="
      (val) =>
        updatePreferences({
          tabbar: { enable: val },
        })
    "
    @update:tabbar-show-icon="
      (val) =>
        updatePreferences({
          tabbar: { showIcon: val },
        })
    "
    @update:navigation-accordion="
      (val) =>
        updatePreferences({
          navigation: { accordion: val },
        })
    "
    @update:navigation-style-type="
      (val) =>
        updatePreferences({
          navigation: { styleType: val },
        })
    "
    @update:navigation-split="
      (val) =>
        updatePreferences({
          navigation: { split: val },
        })
    "
    @update:footer-enable="
      (val) =>
        updatePreferences({
          footer: { enable: val },
        })
    "
    @update:footer-fixed="
      (val) =>
        updatePreferences({
          footer: { fixed: val },
        })
    "
    @update:shortcut-keys-enable="
      (val) =>
        updatePreferences({
          shortcutKeys: { enable: val },
        })
    "
  />
</template>
