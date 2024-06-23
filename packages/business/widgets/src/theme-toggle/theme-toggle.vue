<script lang="ts" setup>
import { $t } from '@vben/locales';
import {
  IcRoundMotionPhotosAuto,
  IcRoundWbSunny,
  MdiMoonAndStars,
} from '@vben-core/iconify';
import {
  type ThemeModeType,
  preferences,
  updatePreferences,
  usePreferences,
} from '@vben-core/preferences';
import {
  ToggleGroup,
  ToggleGroupItem,
  VbenTooltip,
} from '@vben-core/shadcn-ui';

import ThemeButton from './theme-button.vue';

defineOptions({
  name: 'ThemeToggle',
});

withDefaults(defineProps<{ shouldOnHover?: boolean }>(), {
  shouldOnHover: false,
});

function handleChange(isDark: boolean) {
  updatePreferences({
    theme: { mode: isDark ? 'dark' : 'light' },
  });
}

const { isDark } = usePreferences();

const PRESETS = [
  {
    icon: IcRoundWbSunny,
    name: 'light',
    title: $t('preferences.light'),
  },
  {
    icon: MdiMoonAndStars,
    name: 'dark',
    title: $t('preferences.dark'),
  },
  {
    icon: IcRoundMotionPhotosAuto,
    name: 'auto',
    title: $t('preferences.follow-system'),
  },
];
</script>
<template>
  <div>
    <VbenTooltip :disabled="!shouldOnHover" side="bottom">
      <template #trigger>
        <ThemeButton
          :model-value="isDark"
          type="icon"
          @update:model-value="handleChange"
        />
      </template>
      <ToggleGroup
        :model-value="preferences.theme.mode"
        class="gap-2"
        type="single"
        variant="outline"
        @update:model-value="
          (val) => updatePreferences({ theme: { mode: val as ThemeModeType } })
        "
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
