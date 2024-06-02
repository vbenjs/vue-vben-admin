<script lang="ts" setup>
import type { SupportedLanguagesType } from '@vben/types';

import {
  COLOR_PRIMARY_RESETS,
  flatPreferences,
  updatePreferences,
} from '@vben-core/preferences';

import { loadLocaleMessages } from '@vben/locales';

import Preferences from './preferences.vue';

function updateLocale(value: string) {
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: { locale },
  });
  // 更改预览
  loadLocaleMessages(locale);
}
</script>
<template>
  <Preferences
    v-model:breadcrumb-visible="flatPreferences.breadcrumbEnable"
    v-model:breadcrumb-style="flatPreferences.breadcrumbStyleType"
    v-model:color-gray-mode="flatPreferences.appColorGrayMode"
    v-model:breadcrumb-icon="flatPreferences.breadcrumbShowIcon"
    v-model:color-primary="flatPreferences.themeColorPrimary"
    v-model:color-weak-mode="flatPreferences.appColorWeakMode"
    v-model:content-compact="flatPreferences.appContentCompact"
    v-model:breadcrumb-home="flatPreferences.breadcrumbShowHome"
    v-model:side-collapse="flatPreferences.sidebarCollapse"
    v-model:layout="flatPreferences.appLayout"
    v-model:semi-dark-menu="flatPreferences.appSemiDarkMenu"
    v-model:side-visible="flatPreferences.sidebarEnable"
    v-model:footer-visible="flatPreferences.footerEnable"
    v-model:tabs-visible="flatPreferences.tabbarEnable"
    v-model:header-visible="flatPreferences.headerEnable"
    v-model:header-mode="flatPreferences.headerMode"
    v-model:footer-fixed="flatPreferences.footerFixed"
    v-model:theme="flatPreferences.appThemeMode"
    v-model:dynamic-title="flatPreferences.appDynamicTitle"
    v-model:breadcrumb-hide-only-one="flatPreferences.breadcrumbHideOnlyOne"
    v-model:page-transition="flatPreferences.transitionName"
    v-model:page-progress="flatPreferences.transitionProgress"
    v-model:tabs-icon="flatPreferences.tabbarShowIcon"
    v-model:navigation-accordion="flatPreferences.navigationAccordion"
    v-model:navigation-style="flatPreferences.navigationStyleType"
    v-model:shortcut-keys="flatPreferences.shortcutKeysEnable"
    v-model:navigation-split="flatPreferences.navigationSplit"
    v-model:page-transition-enable="flatPreferences.transitionEnable"
    v-model:side-collapse-show-title="flatPreferences.sidebarCollapseShowTitle"
    :color-primary-presets="COLOR_PRIMARY_RESETS"
    :locale="flatPreferences.appLocale"
    @update:locale="updateLocale"
  />
</template>
