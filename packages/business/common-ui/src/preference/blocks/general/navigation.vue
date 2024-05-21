<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import ToggleItem from '../toggle-item.vue';

defineOptions({
  name: 'PreferenceNavigationConfig',
});

defineProps<{ disabled: boolean }>();

const navigationStyle = defineModel<string>('navigationStyle');

const stylesItems: SelectListItem[] = [
  { label: $t('preference.normal'), value: 'normal' },
  { label: $t('preference.rounded'), value: 'rounded' },
];
</script>

<template>
  <ToggleItem v-model="navigationStyle" :items="stylesItems" disabled>
    {{ $t('preference.navigation-style') }}
  </ToggleItem>
</template>
