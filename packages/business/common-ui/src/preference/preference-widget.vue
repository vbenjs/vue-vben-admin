<script lang="ts" setup>
import type { PreferenceKeys, SupportLocale } from '@vben/types';

import { loadLocaleMessages } from '@vben/locales';
import {
  preference,
  staticPreference,
  updatePreference,
} from '@vben/preference';

import Preference from './preference.vue';

function handleUpdate(key: PreferenceKeys, value: boolean | string) {
  updatePreference({
    [key]: value,
  });
}

function updateLocale(value: string) {
  const locale = value as SupportLocale;
  updatePreference({
    locale,
  });
  // 更改预览
  loadLocaleMessages(locale);
}
</script>
<template>
  <Preference
    :color-primary-presets="staticPreference.colorPrimaryPresets"
    :breadcrumb-visible="preference.breadcrumbVisible"
    :breadcrumb-style="preference.breadcrumbStyle"
    :color-gray-mode="preference.colorGrayMode"
    :breadcrumb-icon="preference.breadcrumbIcon"
    :color-primary="preference.colorPrimary"
    :color-weak-mode="preference.colorWeakMode"
    :content-compact="preference.contentCompact"
    :breadcrumb-home="preference.breadcrumbHome"
    :side-collapse="preference.sideCollapse"
    :layout="preference.layout"
    :semi-dark-menu="preference.semiDarkMenu"
    :side-visible="preference.sideVisible"
    :footer-visible="preference.footerVisible"
    :tabs-visible="preference.tabsVisible"
    :header-visible="preference.headerVisible"
    :footer-fixed="preference.footerFixed"
    :header-mode="preference.headerMode"
    :theme="preference.theme"
    :dynamic-title="preference.dynamicTitle"
    :breadcrumb-hide-only-one="preference.breadcrumbHideOnlyOne"
    :page-transition="preference.pageTransition"
    :page-progress="preference.pageProgress"
    :tabs-icon="preference.tabsIcon"
    :locale="preference.locale"
    :navigation-style="preference.navigationStyle"
    :side-collapse-show-title="preference.sideCollapseShowTitle"
    :page-transition-enable="preference.pageTransitionEnable"
    @update:navigation-style="(value) => handleUpdate('navigationStyle', value)"
    @update:dynamic-title="(value) => handleUpdate('dynamicTitle', value)"
    @update:tabs-icon="(value) => handleUpdate('tabsIcon', value)"
    @update:side-collapse="(value) => handleUpdate('sideCollapse', value)"
    @update:locale="updateLocale"
    @update:header-visible="(value) => handleUpdate('headerVisible', value)"
    @update:side-visible="(value) => handleUpdate('sideVisible', value)"
    @update:footer-visible="(value) => handleUpdate('footerVisible', value)"
    @update:tabs-visible="(value) => handleUpdate('tabsVisible', value)"
    @update:header-mode="(value) => handleUpdate('headerMode', value)"
    @update:footer-fixed="(value) => handleUpdate('footerFixed', value)"
    @update:breadcrumb-visible="
      (value) => handleUpdate('breadcrumbVisible', value)
    "
    @update:breadcrumb-hide-only-one="
      (value) => handleUpdate('breadcrumbHideOnlyOne', value)
    "
    @update:side-collapse-show-title="
      (value) => handleUpdate('sideCollapseShowTitle', value)
    "
    @update:breadcrumb-home="(value) => handleUpdate('breadcrumbHome', value)"
    @update:breadcrumb-icon="(value) => handleUpdate('breadcrumbIcon', value)"
    @update:breadcrumb-style="(value) => handleUpdate('breadcrumbStyle', value)"
    @update:page-transition-enable="
      (value) => handleUpdate('pageTransitionEnable', value)
    "
    @update:color-gray-mode="(value) => handleUpdate('colorGrayMode', value)"
    @update:page-transition="(value) => handleUpdate('pageTransition', value)"
    @update:page-progress="(value) => handleUpdate('pageProgress', value)"
    @update:color-primary="(value) => handleUpdate('colorPrimary', value)"
    @update:color-weak-mode="(value) => handleUpdate('colorWeakMode', value)"
    @update:content-compact="(value) => handleUpdate('contentCompact', value)"
    @update:layout="(value) => handleUpdate('layout', value)"
    @update:semi-dark-menu="(value) => handleUpdate('semiDarkMenu', value)"
    @update:theme="(value) => handleUpdate('theme', value)"
  />
</template>
