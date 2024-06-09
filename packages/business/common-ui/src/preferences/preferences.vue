<script setup lang="ts">
import type {
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

import { computed } from 'vue';

import { $t } from '@vben/locales';
import { IcRoundFolderCopy, IcRoundRestartAlt } from '@vben-core/iconify';
import {
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
  ColorMode,
  Content,
  Footer,
  General,
  Header,
  Layout,
  Navigation,
  Sidebar,
  Tabbar,
  Theme,
  ThemeColor,
} from './blocks';
import Trigger from './trigger.vue';
import { useOpenPreferences } from './use-open-preferences';

withDefaults(defineProps<{ colorPrimaryPresets: string[] }>(), {
  colorPrimaryPresets: () => [],
});

const appThemeMode = defineModel<ThemeModeType>('appThemeMode');
const appLocale = defineModel<SupportedLanguagesType>('appLocale');
const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const appLayout = defineModel<LayoutType>('appLayout');
const appColorGrayMode = defineModel<boolean>('appColorGrayMode');
const appColorWeakMode = defineModel<boolean>('appColorWeakMode');
const appSemiDarkMenu = defineModel<boolean>('appSemiDarkMenu');
const appContentCompact = defineModel<ContentCompactType>('appContentCompact');

const transitionProgress = defineModel<boolean>('transitionProgress');
const transitionName = defineModel<string>('transitionName');
const transitionEnable = defineModel<boolean>('transitionEnable');

const themeColorPrimary = defineModel<string>('themeColorPrimary');

const sidebarEnable = defineModel<boolean>('sidebarEnable');
const sidebarCollapse = defineModel<boolean>('sidebarCollapse');
const sidebarCollapseShowTitle = defineModel<boolean>(
  'sidebarCollapseShowTitle',
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

const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable');

const {
  diffPreference,
  isFullContent,
  isHeaderNav,
  isMixedNav,
  isSideMixedNav,
  isSideMode,
  isSideNav,
} = usePreferences();
const { copy } = useClipboard();

const tabs = computed((): SegmentedItem[] => {
  return [
    {
      label: $t('preference.appearance'),
      value: 'appearance',
    },
    {
      label: $t('preference.layout'),
      value: 'layout',
    },
    {
      label: $t('preference.general'),
      value: 'general',
    },
    // {
    //   label: $t('preference.shortcut-key'),
    //   value: 'shortcutKey',
    // },
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

  toast($t('preference.copy-success'));
}

function handleReset() {
  if (!diffPreference.value) {
    return;
  }
  resetPreferences();
  toast($t('preference.reset-success'));
}
</script>

<template>
  <div class="z-100 fixed right-0 top-1/3">
    <VbenSheet
      v-model:open="openPreferences"
      :description="$t('preference.preferences-subtitle')"
      :title="$t('preference.preferences')"
    >
      <template #trigger>
        <Trigger />
      </template>
      <template #extra>
        <VbenIconButton
          :disabled="!diffPreference"
          :tooltip="$t('preference.reset-tip')"
          class="relative"
        >
          <span
            v-if="diffPreference"
            class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
          ></span>
          <IcRoundRestartAlt class="size-5" @click="handleReset" />
        </VbenIconButton>
      </template>

      <div class="p-5 pt-4">
        <VbenSegmented :tabs="tabs" default-value="appearance">
          <template #appearance>
            <Block :title="$t('preference.theme')">
              <Theme
                v-model="appThemeMode"
                v-model:app-semi-dark-menu="appSemiDarkMenu"
              />
            </Block>
            <Block :title="$t('preference.theme-color')">
              <ThemeColor
                v-model="themeColorPrimary"
                :color-primary-presets="colorPrimaryPresets"
              />
            </Block>
            <Block :title="$t('preference.other')">
              <ColorMode
                v-model:app-color-gray-mode="appColorGrayMode"
                v-model:app-color-weak-mode="appColorWeakMode"
              />
            </Block>
          </template>
          <template #layout>
            <Block :title="$t('preference.layout')">
              <Layout v-model="appLayout" />
            </Block>
            <Block :title="$t('preference.content')">
              <Content v-model="appContentCompact" />
            </Block>

            <Block :title="$t('preference.sidebar')">
              <Sidebar
                v-model:side-collapse-show-title="sidebarCollapseShowTitle"
                v-model:sidebar-collapse="sidebarCollapse"
                v-model:sidebar-enable="sidebarEnable"
                :disabled="!isSideMode"
              />
            </Block>

            <Block :title="$t('preference.header')">
              <Header
                v-model:headerEnable="headerEnable"
                v-model:headerMode="headerMode"
                :disabled="isFullContent"
              />
            </Block>

            <Block :title="$t('preference.navigation-menu')">
              <Navigation
                v-model:navigation-accordion="navigationAccordion"
                v-model:navigation-split="navigationSplit"
                v-model:navigation-style-type="navigationStyleType"
                :disabled="isFullContent"
                :disabled-navigation-split="!isMixedNav"
              />
            </Block>

            <Block :title="$t('preference.breadcrumb')">
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

            <Block :title="$t('preference.tabs')">
              <Tabbar
                v-model:tabbar-enable="tabbarEnable"
                v-model:tabbar-show-icon="tabbarShowIcon"
              />
            </Block>
            <Block :title="$t('preference.footer')">
              <Footer
                v-model:footer-enable="footerEnable"
                v-model:footer-fixed="footerFixed"
              />
            </Block>
          </template>
          <template #general>
            <Block :title="$t('preference.general')">
              <General
                v-model:app-dynamic-title="appDynamicTitle"
                v-model:app-locale="appLocale"
                v-model:shortcut-keys-enable="shortcutKeysEnable"
              />
            </Block>

            <Block :title="$t('preference.animation')">
              <Animation
                v-model:transition-enable="transitionEnable"
                v-model:transition-name="transitionName"
                v-model:transition-progress="transitionProgress"
              />
            </Block>
          </template>
          <!-- <template #shortcutKey>
            <Block :title="$t('preference.general')">
              <General
                v-model:locale="locale"
                v-model:dynamic-title="dynamicTitle"
                v-model:shortcut-keys="shortcutKeys"
              />
            </Block>

            <Block :title="$t('preference.animation')">
              <Animation
                v-model:page-progress="pageProgress"
                v-model:page-transition="pageTransition"
                v-model:transition-enable="transitionEnable"
              />
            </Block>
          </template> -->
        </VbenSegmented>
      </div>

      <template #footer>
        <VbenButton
          :disabled="!diffPreference"
          class="mx-6 w-full"
          size="sm"
          variant="default"
          @click="handleCopy"
        >
          <IcRoundFolderCopy class="mr-2 size-3" />
          {{ $t('preference.copy') }}
        </VbenButton>
      </template>
    </VbenSheet>
  </div>
</template>
