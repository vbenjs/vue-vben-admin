<script lang="ts" setup>
import {
  IcRoundMotionPhotosAuto,
  IcRoundWbSunny,
  MdiMoonAndStars,
} from '@vben-core/iconify';
import {
  flatPreferences,
  updatePreferences,
  usePreferences,
} from '@vben-core/preferences';
import {
  ToggleGroup,
  ToggleGroupItem,
  VbenTooltip,
} from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';

import ThemeButton from './theme-button.vue';

defineOptions({
  name: 'ThemeToggle',
});

withDefaults(defineProps<{ shouldOnHover?: boolean }>(), {
  shouldOnHover: false,
});

function handleChange(isDark: boolean) {
  updatePreferences({
    app: { themeMode: isDark ? 'dark' : 'light' },
  });
}

const { isDark } = usePreferences();

const PRESETS = [
  {
    icon: IcRoundWbSunny,
    name: 'light',
    title: $t('preference.light'),
  },
  {
    icon: MdiMoonAndStars,
    name: 'dark',
    title: $t('preference.dark'),
  },
  {
    icon: IcRoundMotionPhotosAuto,
    name: 'auto',
    title: $t('preference.follow-system'),
  },
];
</script>
<template>
  <div>
    <VbenTooltip side="bottom" :disabled="!shouldOnHover">
      <template #trigger>
        <ThemeButton
          :model-value="isDark"
          type="icon"
          @update:model-value="handleChange"
        />
      </template>
      <ToggleGroup
        v-model="flatPreferences.appThemeMode"
        type="single"
        variant="outline"
        class="gap-2"
      >
        <ToggleGroupItem
          v-for="item in PRESETS"
          :key="item.name"
          :value="item.name"
        >
          <component :is="item.icon" class="size-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </VbenTooltip>
  </div>
</template>
