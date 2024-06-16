<script setup lang="ts">
import type { LayoutType } from '@vben/types';

import { type Component, computed } from 'vue';

import { $t } from '@vben/locales';
import { MdiQuestionMarkCircleOutline } from '@vben-core/iconify';
import { VbenTooltip } from '@vben-core/shadcn-ui';

import {
  FullContent,
  HeaderNav,
  MixedNav,
  SidebarMixedNav,
  SidebarNav,
} from '../../icons';

interface PresetItem {
  name: string;
  tip: string;
  type: LayoutType;
}

defineOptions({
  name: 'PreferenceLayout',
});

const modelValue = defineModel<LayoutType>({ default: 'sidebar-nav' });

const components: Record<LayoutType, Component> = {
  'full-content': FullContent,
  'header-nav': HeaderNav,
  'mixed-nav': MixedNav,
  'sidebar-mixed-nav': SidebarMixedNav,
  'sidebar-nav': SidebarNav,
};

const PRESET = computed((): PresetItem[] => [
  {
    name: $t('preferences.vertical'),
    tip: $t('preferences.vertical-tip'),
    type: 'sidebar-nav',
  },
  {
    name: $t('preferences.two-column'),
    tip: $t('preferences.two-column-tip'),
    type: 'sidebar-mixed-nav',
  },
  {
    name: $t('preferences.horizontal'),
    tip: $t('preferences.vertical-tip'),
    type: 'header-nav',
  },
  {
    name: $t('preferences.mixed-menu'),
    tip: $t('preferences.mixed-menu-tip'),
    type: 'mixed-nav',
  },
  {
    name: $t('preferences.full-content'),
    tip: $t('preferences.full-content-tip'),
    type: 'full-content',
  },
]);

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : [];
}
</script>

<template>
  <div class="flex w-full flex-wrap gap-5">
    <template v-for="theme in PRESET" :key="theme.name">
      <div
        class="flex w-[100px] cursor-pointer flex-col"
        @click="modelValue = theme.type"
      >
        <div :class="activeClass(theme.type)" class="outline-box flex-center">
          <component :is="components[theme.type]" />
        </div>
        <div
          class="text-muted-foreground flex-center hover:text-foreground mt-2 text-center text-xs"
        >
          {{ theme.name }}
          <VbenTooltip v-if="theme.tip" side="bottom">
            <template #trigger>
              <MdiQuestionMarkCircleOutline class="ml-1 cursor-help" />
            </template>
            {{ theme.tip }}
          </VbenTooltip>
        </div>
      </div>
    </template>
  </div>
</template>
