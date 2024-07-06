<script setup lang="ts">
import type {
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  SupportedLanguagesType,
  ThemeModeType,
} from '@vben/types';
import type {
  BreadcrumbStyleType,
  NavigationStyleType,
} from '@vben-core/preferences';
import type { SegmentedItem } from '@vben-core/shadcn-ui';

import { computed, ref } from 'vue';

import { IcRoundFolderCopy, IcRoundRestartAlt } from '@vben-core/iconify';
import { $t, loadLocaleMessages } from '@vben-core/locales';
import {
  clearPreferencesCache,
  preferences,
  resetPreferences,
  usePreferences,
} from '@vben-core/preferences';
import {
  VbenButton,
  VbenIconButton,
  VbenSegmented,
  VbenSheet,
  toast,
} from '@vben-core/shadcn-ui';

import { useClipboard } from '@vueuse/core';

import {
  Animation,
  Block,
  Breadcrumb,
  BuiltinTheme,
  ColorMode,
  Content,
  Copyright,
  Footer,
  General,
  GlobalShortcutKeys,
  Header,
  Layout,
  Navigation,
  Radius,
  Sidebar,
  Tabbar,
  Theme,
} from './blocks';
import Trigger from './trigger.vue';
import { useOpenPreferences } from './use-open-preferences';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const appLocale = defineModel<SupportedLanguagesType>('appLocale');
const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const appAiAssistant = defineModel<boolean>('appAiAssistant');
const appLayout = defineModel<LayoutType>('appLayout');
const appColorGrayMode = defineModel<boolean>('appColorGrayMode');
const appColorWeakMode = defineModel<boolean>('appColorWeakMode');
const appSemiDarkMenu = defineModel<boolean>('appSemiDarkMenu');
const appContentCompact = defineModel<ContentCompactType>('appContentCompact');

const transitionProgress = defineModel<boolean>('transitionProgress');
const transitionName = defineModel<string>('transitionName');
const transitionLoading = defineModel<boolean>('transitionLoading');
const transitionEnable = defineModel<boolean>('transitionEnable');

const themeColorPrimary = defineModel<string>('themeColorPrimary');
const themeBuiltinType = defineModel<BuiltinThemeType>('themeBuiltinType');
const themeMode = defineModel<ThemeModeType>('themeMode');
const themeRadius = defineModel<string>('themeRadius');

const sidebarEnable = defineModel<boolean>('sidebarEnable');
const sidebarWidth = defineModel<number>('sidebarWidth');
const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed');
const sidebarCollapsedShowTitle = defineModel<boolean>(
  'sidebarCollapsedShowTitle',
);

const headerEnable = defineModel<boolean>('headerEnable');
const headerMode = defineModel<LayoutHeaderModeType>('headerMode');

const breadcrumbEnable = defineModel<boolean>('breadcrumbEnable');
const breadcrumbShowIcon = defineModel<boolean>('breadcrumbShowIcon');
const breadcrumbShowHome = defineModel<boolean>('breadcrumbShowHome');
const breadcrumbStyleType = defineModel<BreadcrumbStyleType>(
  'breadcrumbStyleType',
);
const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne');

const tabbarEnable = defineModel<boolean>('tabbarEnable');
const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon');

const navigationStyleType = defineModel<NavigationStyleType>(
  'navigationStyleType',
);
const navigationSplit = defineModel<boolean>('navigationSplit');
const navigationAccordion = defineModel<boolean>('navigationAccordion');

// const logoVisible = defineModel<boolean>('logoVisible');

const footerEnable = defineModel<boolean>('footerEnable');
const footerFixed = defineModel<boolean>('footerFixed');

const copyrightEnable = defineModel<boolean>('copyrightEnable');
const copyrightCompanyName = defineModel<string>('copyrightCompanyName');
const copyrightCompanySiteLink = defineModel<string>(
  'copyrightCompanySiteLink',
);
const copyrightDate = defineModel<string>('copyrightDate');
const copyrightIcp = defineModel<string>('copyrightIcp');
const copyrightIcpLink = defineModel<string>('copyrightIcpLink');

const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable');
const shortcutKeysGlobalSearch = defineModel<boolean>(
  'shortcutKeysGlobalSearch',
);
const shortcutKeysGlobalLogout = defineModel<boolean>(
  'shortcutKeysGlobalLogout',
);
const shortcutKeysGlobalPreferences = defineModel<boolean>(
  'shortcutKeysGlobalPreferences',
);

const {
  diffPreference,
  isDark,
  isFullContent,
  isHeaderNav,
  isMixedNav,
  isSideMixedNav,
  isSideMode,
  isSideNav,
} = usePreferences();
const { copy } = useClipboard();

const activeTab = ref('appearance');

const tabs = computed((): SegmentedItem[] => {
  return [
    {
      label: $t('preferences.appearance'),
      value: 'appearance',
    },
    {
      label: $t('preferences.layout'),
      value: 'layout',
    },
    {
      label: $t('preferences.shortcut-keys.title'),
      value: 'shortcutKey',
    },
    {
      label: $t('preferences.general'),
      value: 'general',
    },
  ];
});

const showBreadcrumbConfig = computed(() => {
  return (
    !isFullContent.value &&
    !isMixedNav.value &&
    !isHeaderNav.value &&
    preferences.header.enable
  );
});

const { openPreferences } = useOpenPreferences();

async function handleCopy() {
  await copy(JSON.stringify(diffPreference.value, null, 2));

  toast($t('preferences.copy-success'));
}

async function handleClearCache() {
  resetPreferences();
  clearPreferencesCache();
  emit('clearPreferencesAndLogout');
}

async function handleReset() {
  if (!diffPreference.value) {
    return;
  }
  resetPreferences();
  await loadLocaleMessages(preferences.app.locale);
  toast($t('preferences.reset-success'));
}
</script>

<template>
  <div class="z-100 fixed right-0 top-1/2">
    <VbenSheet
      v-model:open="openPreferences"
      :description="$t('preferences.subtitle')"
      :title="$t('preferences.title')"
    >
      <template #trigger>
        <Trigger />
      </template>
      <template #extra>
        <div class="flex items-center">
          <VbenIconButton
            :disabled="!diffPreference"
            :tooltip="$t('preferences.reset-tip')"
            class="relative"
          >
            <span
              v-if="diffPreference"
              class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
            ></span>
            <IcRoundRestartAlt class="size-5" @click="handleReset" />
          </VbenIconButton>
        </div>
      </template>

      <div class="p-4 pt-4">
        <VbenSegmented v-model="activeTab" :tabs="tabs">
          <template #general>
            <Block :title="$t('preferences.general')">
              <General
                v-model:app-ai-assistant="appAiAssistant"
                v-model:app-dynamic-title="appDynamicTitle"
                v-model:app-locale="appLocale"
              />
            </Block>

            <Block :title="$t('preferences.animation.title')">
              <Animation
                v-model:transition-enable="transitionEnable"
                v-model:transition-loading="transitionLoading"
                v-model:transition-name="transitionName"
                v-model:transition-progress="transitionProgress"
              />
            </Block>
          </template>
          <template #appearance>
            <Block :title="$t('preferences.theme.title')">
              <Theme
                v-model="themeMode"
                v-model:app-semi-dark-menu="appSemiDarkMenu"
              />
            </Block>
            <!-- <Block :title="$t('preferences.theme-color')">
              <ThemeColor
                v-model="themeColorPrimary"
                :color-primary-presets="colorPrimaryPresets"
              />
            </Block> -->
            <Block :title="$t('preferences.theme.builtin.title')">
              <BuiltinTheme
                v-model="themeBuiltinType"
                v-model:theme-color-primary="themeColorPrimary"
                :is-dark="isDark"
              />
            </Block>
            <Block :title="$t('preferences.theme.radius')">
              <Radius v-model="themeRadius" />
            </Block>
            <Block :title="$t('preferences.other')">
              <ColorMode
                v-model:app-color-gray-mode="appColorGrayMode"
                v-model:app-color-weak-mode="appColorWeakMode"
              />
            </Block>
          </template>
          <template #layout>
            <Block :title="$t('preferences.layout')">
              <Layout v-model="appLayout" />
            </Block>
            <Block :title="$t('preferences.content')">
              <Content v-model="appContentCompact" />
            </Block>

            <Block :title="$t('preferences.sidebar.title')">
              <Sidebar
                v-model:sidebar-collapsed="sidebarCollapsed"
                v-model:sidebar-collapsed-show-title="sidebarCollapsedShowTitle"
                v-model:sidebar-enable="sidebarEnable"
                v-model:sidebar-width="sidebarWidth"
                :disabled="!isSideMode"
              />
            </Block>

            <Block :title="$t('preferences.header.title')">
              <Header
                v-model:headerEnable="headerEnable"
                v-model:headerMode="headerMode"
                :disabled="isFullContent"
              />
            </Block>

            <Block :title="$t('preferences.navigation-menu.title')">
              <Navigation
                v-model:navigation-accordion="navigationAccordion"
                v-model:navigation-split="navigationSplit"
                v-model:navigation-style-type="navigationStyleType"
                :disabled="isFullContent"
                :disabled-navigation-split="!isMixedNav"
              />
            </Block>

            <Block :title="$t('preferences.breadcrumb.title')">
              <Breadcrumb
                v-model:breadcrumb-enable="breadcrumbEnable"
                v-model:breadcrumb-hide-only-one="breadcrumbHideOnlyOne"
                v-model:breadcrumb-show-home="breadcrumbShowHome"
                v-model:breadcrumb-show-icon="breadcrumbShowIcon"
                v-model:breadcrumb-style-type="breadcrumbStyleType"
                :disabled="
                  !showBreadcrumbConfig || !(isSideNav || isSideMixedNav)
                "
              />
            </Block>

            <Block :title="$t('preferences.tabbar.title')">
              <Tabbar
                v-model:tabbar-enable="tabbarEnable"
                v-model:tabbar-show-icon="tabbarShowIcon"
              />
            </Block>
            <Block :title="$t('preferences.footer.title')">
              <Footer
                v-model:footer-enable="footerEnable"
                v-model:footer-fixed="footerFixed"
              />
            </Block>
            <Block :title="$t('preferences.copyright.title')">
              <Copyright
                v-model:copyright-company-name="copyrightCompanyName"
                v-model:copyright-company-site-link="copyrightCompanySiteLink"
                v-model:copyright-date="copyrightDate"
                v-model:copyright-enable="copyrightEnable"
                v-model:copyright-icp="copyrightIcp"
                v-model:copyright-icp-link="copyrightIcpLink"
              />
            </Block>
          </template>

          <template #shortcutKey>
            <Block :title="$t('preferences.shortcut-keys.global')">
              <GlobalShortcutKeys
                v-model:shortcut-keys-enable="shortcutKeysEnable"
                v-model:shortcut-keys-global-search="shortcutKeysGlobalSearch"
                v-model:shortcut-keys-logout="shortcutKeysGlobalLogout"
                v-model:shortcut-keys-preferences="
                  shortcutKeysGlobalPreferences
                "
              />
            </Block>
          </template>
        </VbenSegmented>
      </div>

      <template #footer>
        <VbenButton
          :disabled="!diffPreference"
          class="mx-4 w-full"
          size="sm"
          variant="outline"
          @click="handleClearCache"
        >
          <IcRoundRestartAlt class="mr-2 size-4" />
          {{ $t('preferences.clear-and-logout') }}
        </VbenButton>
        <VbenButton
          :disabled="!diffPreference"
          class="mr-4 w-full"
          size="sm"
          variant="default"
          @click="handleCopy"
        >
          <IcRoundFolderCopy class="mr-2 size-3" />
          {{ $t('preferences.copy') }}
        </VbenButton>
      </template>
    </VbenSheet>
  </div>
</template>
