<script setup lang="ts">
import type { ThemeModeType } from '@vben-core/preferences';

import type { Component } from 'vue';

import {
  IcRoundMotionPhotosAuto,
  IcRoundWbSunny,
  MdiMoonAndStars,
} from '@vben-core/iconify';
import { $t } from '@vben-core/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTheme',
});

const modelValue = defineModel<string>({ default: 'auto' });
const appSemiDarkMenu = defineModel<boolean>('appSemiDarkMenu', {
  default: true,
});

const THEME_PRESET: Array<{ icon: Component; name: ThemeModeType }> = [
  {
    icon: IcRoundWbSunny,
    name: 'light',
  },
  {
    icon: MdiMoonAndStars,
    name: 'dark',
  },
  {
    icon: IcRoundMotionPhotosAuto,
    name: 'auto',
  },
];

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : [];
}

function nameView(name: string) {
  switch (name) {
    case 'light': {
      return $t('preferences.theme.light');
    }
    case 'dark': {
      return $t('preferences.theme.dark');
    }
    case 'auto': {
      return $t('preferences.follow-system');
    }
  }
}
</script>

<template>
  <div class="flex w-full flex-wrap justify-between">
    <template v-for="theme in THEME_PRESET" :key="theme.name">
      <div
        class="flex cursor-pointer flex-col"
        @click="modelValue = theme.name"
      >
        <div
          :class="activeClass(theme.name)"
          class="outline-box flex-center py-4"
        >
          <component :is="theme.icon" class="mx-9 size-5" />
        </div>
        <div class="text-muted-foreground mt-2 text-center text-xs">
          {{ nameView(theme.name) }}
        </div>
      </div>
    </template>

    <SwitchItem
      v-model="appSemiDarkMenu"
      :disabled="modelValue !== 'light'"
      class="mt-6"
    >
      {{ $t('preferences.theme.dark-menu') }}
    </SwitchItem>
  </div>
</template>
