<script setup lang="ts">
import type { LayoutHeaderModeType, SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const headerEnable = defineModel<boolean>('headerEnable');
const headerMode = defineModel<LayoutHeaderModeType>('headerMode');

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
  <SwitchItem v-model="headerEnable" :disabled="disabled">
    {{ $t('preference.header-visible') }}
  </SwitchItem>
  <SelectItem
    v-model="headerMode"
    :items="localeItems"
    :disabled="!headerEnable"
  >
    {{ $t('preference.mode') }}
  </SelectItem>
</template>
