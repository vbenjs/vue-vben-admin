<script lang="ts" setup>
import { loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben-core/preferences';

import Preferences from './preferences.vue';
</script>
<template>
  <Preferences
    :app-ai-assistant="preferences.app.aiAssistant"
    :app-color-gray-mode="preferences.app.colorGrayMode"
    :app-color-weak-mode="preferences.app.colorWeakMode"
    :app-content-compact="preferences.app.contentCompact"
    :app-dynamic-title="preferences.app.dynamicTitle"
    :app-layout="preferences.app.layout"
    :app-locale="preferences.app.locale"
    :app-semi-dark-menu="preferences.app.semiDarkMenu"
    :breadcrumb-enable="preferences.breadcrumb.enable"
    :breadcrumb-hide-only-one="preferences.breadcrumb.hideOnlyOne"
    :breadcrumb-show-home="preferences.breadcrumb.showHome"
    :breadcrumb-show-icon="preferences.breadcrumb.showIcon"
    :breadcrumb-style-type="preferences.breadcrumb.styleType"
    :copyright-company-name="preferences.copyright.companyName"
    :copyright-company-site-link="preferences.copyright.companySiteLink"
    :copyright-date="preferences.copyright.date"
    :copyright-enable="preferences.copyright.enable"
    :copyright-icp="preferences.copyright.icp"
    :copyright-icp-link="preferences.copyright.icpLink"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :header-enable="preferences.header.enable"
    :header-mode="preferences.header.mode"
    :navigation-accordion="preferences.navigation.accordion"
    :navigation-split="preferences.navigation.split"
    :navigation-style-type="preferences.navigation.styleType"
    :shortcut-keys-enable="preferences.shortcutKeys.enable"
    :shortcut-keys-global-logout="preferences.shortcutKeys.globalLogout"
    :shortcut-keys-global-preferences="
      preferences.shortcutKeys.globalPreferences
    "
    :shortcut-keys-global-search="preferences.shortcutKeys.globalSearch"
    :sidebar-collapsed="preferences.sidebar.collapsed"
    :sidebar-collapsed-show-title="preferences.sidebar.collapsedShowTitle"
    :sidebar-enable="preferences.sidebar.enable"
    :sidebar-width="preferences.sidebar.width"
    :tabbar-enable="preferences.tabbar.enable"
    :tabbar-show-icon="preferences.tabbar.showIcon"
    :theme-builtin-type="preferences.theme.builtinType"
    :theme-color-primary="preferences.theme.colorPrimary"
    :theme-mode="preferences.theme.mode"
    :theme-radius="preferences.theme.radius"
    :transition-enable="preferences.transition.enable"
    :transition-loading="preferences.transition.loading"
    :transition-name="preferences.transition.name"
    :transition-progress="preferences.transition.progress"
    @update:app-ai-assistant="
      (val) => updatePreferences({ app: { aiAssistant: val } })
    "
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
    @update:copyright-company-name="
      (val) => updatePreferences({ copyright: { companyName: val } })
    "
    @update:copyright-company-site-link="
      (val) => updatePreferences({ copyright: { companySiteLink: val } })
    "
    @update:copyright-date="
      (val) => updatePreferences({ copyright: { date: val } })
    "
    @update:copyright-enable="
      (val) => updatePreferences({ copyright: { enable: val } })
    "
    @update:copyright-icp="
      (val) => updatePreferences({ copyright: { icp: val } })
    "
    @update:copyright-icp-link="
      (val) => updatePreferences({ copyright: { icpLink: val } })
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
    @update:shortcut-keys-global-logout="
      (val) => updatePreferences({ shortcutKeys: { globalLogout: val } })
    "
    @update:shortcut-keys-global-preferences="
      (val) => updatePreferences({ shortcutKeys: { globalPreferences: val } })
    "
    @update:shortcut-keys-global-search="
      (val) => updatePreferences({ shortcutKeys: { globalSearch: val } })
    "
    @update:sidebar-collapsed="
      (val) => updatePreferences({ sidebar: { collapsed: val } })
    "
    @update:sidebar-collapsed-show-title="
      (val) => updatePreferences({ sidebar: { collapsedShowTitle: val } })
    "
    @update:sidebar-enable="
      (val) => updatePreferences({ sidebar: { enable: val } })
    "
    @update:sidebar-width="
      (val) => updatePreferences({ sidebar: { width: val } })
    "
    @update:tabbar-enable="
      (val) => updatePreferences({ tabbar: { enable: val } })
    "
    @update:tabbar-show-icon="
      (val) => updatePreferences({ tabbar: { showIcon: val } })
    "
    @update:theme-builtin-type="
      (val) => updatePreferences({ theme: { builtinType: val } })
    "
    @update:theme-color-primary="
      (val) => updatePreferences({ theme: { colorPrimary: val } })
    "
    @update:theme-mode="(val) => updatePreferences({ theme: { mode: val } })"
    @update:theme-radius="
      (val) => updatePreferences({ theme: { radius: val } })
    "
    @update:transition-enable="
      (val) => updatePreferences({ transition: { enable: val } })
    "
    @update:transition-loading="
      (val) => updatePreferences({ transition: { loading: val } })
    "
    @update:transition-name="
      (val) => updatePreferences({ transition: { name: val } })
    "
    @update:transition-progress="
      (val) => updatePreferences({ transition: { progress: val } })
    "
  />
</template>
