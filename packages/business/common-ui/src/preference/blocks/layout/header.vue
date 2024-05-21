<script setup lang="ts">
import type { LayoutHeaderMode, SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const headerVisible = defineModel<boolean>('headerVisible');
const headerMode = defineModel<LayoutHeaderMode>('headerMode');

const localeItems: SelectListItem[] = [
  {
    label: $t('preference.header-mode-static'),
    value: 'static',
  },
  {
    label: $t('preference.header-mode-fixed'),
    value: 'fixed',
  },
  {
    label: $t('preference.header-mode-auto'),
    value: 'auto',
  },
  {
    label: $t('preference.header-mode-auto-scroll'),
    value: 'auto-scroll',
  },
];
</script>

<template>
  <SwitchItem v-model="headerVisible" :disabled="disabled">
    {{ $t('preference.header-visible') }}
  </SwitchItem>
  <SelectItem
    v-model="headerMode"
    :items="localeItems"
    :disabled="!headerVisible"
  >
    {{ $t('preference.mode') }}
  </SelectItem>
</template>
