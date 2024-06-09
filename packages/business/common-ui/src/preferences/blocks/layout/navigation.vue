<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';
import ToggleItem from '../toggle-item.vue';

defineOptions({
  name: 'PreferenceNavigationConfig',
});

defineProps<{ disabled?: boolean; disabledNavigationSplit?: boolean }>();

const navigationStyleType = defineModel<string>('navigationStyleType');
const navigationSplit = defineModel<boolean>('navigationSplit');
const navigationAccordion = defineModel<boolean>('navigationAccordion');

const stylesItems: SelectListItem[] = [
  { label: $t('preference.rounded'), value: 'rounded' },
  { label: $t('preference.plain'), value: 'plain' },
];
</script>

<template>
  <ToggleItem
    v-model="navigationStyleType"
    :disabled="disabled"
    :items="stylesItems"
  >
    {{ $t('preference.navigation-style') }}
  </ToggleItem>
  <SwitchItem
    v-model="navigationSplit"
    :disabled="disabledNavigationSplit || disabled"
  >
    {{ $t('preference.navigation-split') }}
    <template #tip>
      {{ $t('preference.navigation-split-tip') }}
    </template>
  </SwitchItem>
  <SwitchItem v-model="navigationAccordion" :disabled="disabled">
    {{ $t('preference.navigation-accordion') }}
  </SwitchItem>
</template>
