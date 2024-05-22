<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';
import ToggleItem from '../toggle-item.vue';

defineOptions({
  name: 'PreferenceNavigationConfig',
});

defineProps<{ disabled?: boolean; disabledNavigationSplit?: boolean }>();

const navigationStyle = defineModel<string>('navigationStyle');
const navigationSplit = defineModel<boolean>('navigationSplit');

const stylesItems: SelectListItem[] = [
  { label: $t('preference.rounded'), value: 'rounded' },
  { label: $t('preference.plain'), value: 'plain' },
];
</script>

<template>
  <ToggleItem
    v-model="navigationStyle"
    :items="stylesItems"
    :disabled="disabled"
  >
    {{ $t('preference.navigation-style') }}
  </ToggleItem>
  <SwitchItem v-model="navigationSplit" :disabled="disabledNavigationSplit">
    {{ $t('preference.navigation-split') }}
    <template #tip>
      {{ $t('preference.navigation-split-tip') }}
    </template>
  </SwitchItem>
</template>
