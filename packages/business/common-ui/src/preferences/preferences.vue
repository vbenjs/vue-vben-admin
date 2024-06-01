<script setup lang="ts">
import type { LayoutHeaderModeType, LayoutType } from '@vben/types';
import type { SegmentedItem } from '@vben-core/shadcn-ui';

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

import { $t } from '@vben/locales';
import { useClipboard } from '@vueuse/core';
import { computed } from 'vue';

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
  Tabs,
  Theme,
  ThemeColor,
} from './blocks';
import Trigger from './trigger.vue';
import { useOpenPreferences } from './use-open-preferences';

withDefaults(defineProps<{ colorPrimaryPresets: string[] }>(), {
  colorPrimaryPresets: () => [],
});

const theme = defineModel<string>('theme');
const locale = defineModel<string>('locale');
const dynamicTitle = defineModel<boolean>('dynamicTitle');
const semiDarkMenu = defineModel<boolean>('semiDarkMenu');
const breadcrumbVisible = defineModel<boolean>('breadcrumbVisible');
const breadcrumbIcon = defineModel<boolean>('breadcrumbIcon');
const breadcrumbHome = defineModel<boolean>('breadcrumbHome');
const breadcrumbStyle = defineModel<string>('breadcrumbStyle');
const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne');
const sideCollapseShowTitle = defineModel<boolean>('sideCollapseShowTitle');
const sideCollapse = defineModel<boolean>('sideCollapse');
const colorWeakMode = defineModel<boolean>('colorWeakMode');
const colorGrayMode = defineModel<boolean>('colorGrayMode');
const colorPrimary = defineModel<string>('colorPrimary');
const navigationStyle = defineModel<string>('navigationStyle');
const navigationSplit = defineModel<boolean>('navigationSplit');
const navigationAccordion = defineModel<boolean>('navigationAccordion');
const pageProgress = defineModel<boolean>('pageProgress');
const pageTransition = defineModel<string>('pageTransition');
const pageTransitionEnable = defineModel<boolean>('pageTransitionEnable');
const layout = defineModel<LayoutType>('layout');
const contentCompact = defineModel<string>('contentCompact');
const sideVisible = defineModel<boolean>('sideVisible');
const shortcutKeys = defineModel<boolean>('shortcutKeys');
const tabsVisible = defineModel<boolean>('tabsVisible');
const tabsIcon = defineModel<boolean>('tabsIcon');
// const logoVisible = defineModel<boolean>('logoVisible');
const headerVisible = defineModel<boolean>('headerVisible');
const headerMode = defineModel<LayoutHeaderModeType>('headerMode');
const footerVisible = defineModel<boolean>('footerVisible');
const footerFixed = defineModel<boolean>('footerFixed');

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
          class="relative"
          :disabled="!diffPreference"
          :tooltip="$t('preference.reset-tip')"
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
              <Theme v-model="theme" v-model:semi-dark-menu="semiDarkMenu" />
            </Block>
            <Block :title="$t('preference.theme-color')">
              <ThemeColor
                v-model="colorPrimary"
                :color-primary-presets="colorPrimaryPresets"
              />
            </Block>
            <Block :title="$t('preference.other')">
              <ColorMode
                v-model:color-gray-mode="colorGrayMode"
                v-model:color-weak-mode="colorWeakMode"
              />
            </Block>
          </template>
          <template #layout>
            <Block :title="$t('preference.layout')">
              <Layout v-model="layout" />
            </Block>
            <Block :title="$t('preference.content')">
              <Content v-model="contentCompact" />
            </Block>

            <Block :title="$t('preference.sidebar')">
              <Sidebar
                v-model:side-visible="sideVisible"
                v-model:side-collapse="sideCollapse"
                v-model:side-collapse-show-title="sideCollapseShowTitle"
                :disabled="!isSideMode"
              />
            </Block>

            <Block :title="$t('preference.header')">
              <Header
                v-model:header-visible="headerVisible"
                v-model:headerMode="headerMode"
                :disabled="isFullContent"
              />
            </Block>

            <Block :title="$t('preference.navigation-menu')">
              <Navigation
                v-model:navigation-style="navigationStyle"
                v-model:navigation-split="navigationSplit"
                v-model:navigation-accordion="navigationAccordion"
                :disabled="isFullContent"
                :disabled-navigation-split="!isMixedNav"
              />
            </Block>

            <Block :title="$t('preference.breadcrumb')">
              <Breadcrumb
                v-model:breadcrumb-visible="breadcrumbVisible"
                v-model:breadcrumb-icon="breadcrumbIcon"
                v-model:breadcrumb-style="breadcrumbStyle"
                v-model:breadcrumb-home="breadcrumbHome"
                v-model:breadcrumb-hide-only-one="breadcrumbHideOnlyOne"
                :disabled="
                  !showBreadcrumbConfig || !(isSideNav || isSideMixedNav)
                "
              />
            </Block>

            <Block :title="$t('preference.tabs')">
              <Tabs
                v-model:tabs-visible="tabsVisible"
                v-model:tabs-icon="tabsIcon"
              />
            </Block>
            <Block :title="$t('preference.footer')">
              <Footer
                v-model:footer-visible="footerVisible"
                v-model:footer-fixed="footerFixed"
              />
            </Block>
          </template>
          <template #general>
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
                v-model:page-transition-enable="pageTransitionEnable"
              />
            </Block>
          </template>
          <template #shortcutKey>
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
                v-model:page-transition-enable="pageTransitionEnable"
              />
            </Block>
          </template>
        </VbenSegmented>
      </div>

      <template #footer>
        <VbenButton
          class="mx-6 w-full"
          variant="default"
          size="sm"
          :disabled="!diffPreference"
          @click="handleCopy"
        >
          <IcRoundFolderCopy class="mr-2 size-3" />
          {{ $t('preference.copy') }}
        </VbenButton>
      </template>
    </VbenSheet>
  </div>
</template>
