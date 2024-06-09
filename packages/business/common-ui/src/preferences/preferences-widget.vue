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
    :app-color-gray-mode="preferences.app.colorGrayMode"
    :app-color-weak-mode="preferences.app.colorWeakMode"
    :app-content-compact="preferences.app.contentCompact"
    :app-dynamic-title="preferences.app.dynamicTitle"
    :app-layout="preferences.app.layout"
    :app-locale="preferences.app.locale"
    :app-semi-dark-menu="preferences.app.semiDarkMenu"
    :app-theme-mode="preferences.app.themeMode"
    :breadcrumb-enable="preferences.breadcrumb.enable"
    :breadcrumb-hide-only-one="preferences.breadcrumb.hideOnlyOne"
    :breadcrumb-home="preferences.breadcrumb.showHome"
    :breadcrumb-icon="preferences.breadcrumb.showIcon"
    :breadcrumb-style="preferences.breadcrumb.styleType"
    :color-primary-presets="COLOR_PRIMARY_RESETS"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :header-enable="preferences.header.enable"
    :header-mode="preferences.header.mode"
    :navigation-accordion="preferences.navigation.accordion"
    :navigation-split="preferences.navigation.split"
    :navigation-style-type="preferences.navigation.styleType"
    :shortcut-keys-enable="preferences.shortcutKeys.enable"
    :sidebar-collapse="preferences.sidebar.collapse"
    :sidebar-collapse-show-title="preferences.sidebar.collapseShowTitle"
    :sidebar-enable="preferences.sidebar.enable"
    :tabbar-enable="preferences.tabbar.enable"
    :tabbar-show-icon="preferences.tabbar.showIcon"
    :theme-color-primary="preferences.theme.colorPrimary"
    :transition-enable="preferences.transition.enable"
    :transition-name="preferences.transition.name"
    :transition-progress="preferences.transition.progress"
    @update:app-color-gray-mode="
      (val) => updatePreferences({ app: { colorGrayMode: val } })
    "
    @update:app-color-weak-mode="
      (val) => updatePreferences({ app: { colorWeakMode: val } })
    "
    @update:app-content-compact="
      (val) => updatePreferences({ app: { contentCompact: val } })
    "
    @update:app-dynamic-title="
      (val) => updatePreferences({ app: { dynamicTitle: val } })
    "
    @update:app-layout="(val) => updatePreferences({ app: { layout: val } })"
    @update:app-locale="
      (val) => {
        updatePreferences({ app: { locale: val } });
        loadLocaleMessages(val);
      }
    "
    @update:app-semi-dark-menu="
      (val) => updatePreferences({ app: { semiDarkMenu: val } })
    "
    @update:app-theme-mode="
      (val) => updatePreferences({ app: { themeMode: val } })
    "
    @update:breadcrumb-enable="
      (val) => updatePreferences({ breadcrumb: { enable: val } })
    "
    @update:breadcrumb-hide-only-one="
      (val) => updatePreferences({ breadcrumb: { hideOnlyOne: val } })
    "
    @update:breadcrumb-show-home="
      (val) => updatePreferences({ breadcrumb: { showHome: val } })
    "
    @update:breadcrumb-show-icon="
      (val) => updatePreferences({ breadcrumb: { showIcon: val } })
    "
    @update:breadcrumb-style-type="
      (val) => updatePreferences({ breadcrumb: { styleType: val } })
    "
    @update:footer-enable="
      (val) => updatePreferences({ footer: { enable: val } })
    "
    @update:footer-fixed="
      (val) => updatePreferences({ footer: { fixed: val } })
    "
    @update:header-enable="
      (val) => updatePreferences({ header: { enable: val } })
    "
    @update:header-mode="(val) => updatePreferences({ header: { mode: val } })"
    @update:navigation-accordion="
      (val) => updatePreferences({ navigation: { accordion: val } })
    "
    @update:navigation-split="
      (val) => updatePreferences({ navigation: { split: val } })
    "
    @update:navigation-style-type="
      (val) => updatePreferences({ navigation: { styleType: val } })
    "
    @update:shortcut-keys-enable="
      (val) => updatePreferences({ shortcutKeys: { enable: val } })
    "
    @update:sidebar-collapse="
      (val) => updatePreferences({ sidebar: { collapse: val } })
    "
    @update:sidebar-collapse-show-title="
      (val) => updatePreferences({ sidebar: { collapseShowTitle: val } })
    "
    @update:sidebar-enable="
      (val) => updatePreferences({ sidebar: { enable: val } })
    "
    @update:tabbar-enable="
      (val) => updatePreferences({ tabbar: { enable: val } })
    "
    @update:tabbar-show-icon="
      (val) => updatePreferences({ tabbar: { showIcon: val } })
    "
    @update:theme-color-primary="
      (val) => updatePreferences({ theme: { colorPrimary: val } })
    "
    @update:transition-enable="
      (val) => updatePreferences({ transition: { enable: val } })
    "
    @update:transition-name="
      (val) => updatePreferences({ transition: { name: val } })
    "
    @update:transition-progress="
      (val) => updatePreferences({ transition: { progress: val } })
    "
  />
</template>
