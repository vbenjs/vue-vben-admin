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
    label: $t('preferences.header.mode-static'),
    value: 'static',
  },
  {
    label: $t('preferences.header.mode-fixed'),
    value: 'fixed',
  },
  {
    label: $t('preferences.header.mode-auto'),
    value: 'auto',
  },
  {
    label: $t('preferences.header.mode-auto-scroll'),
    value: 'auto-scroll',
  },
];
</script>

<template>
  <SwitchItem v-model="headerEnable" :disabled="disabled">
    {{ $t('preferences.header-visible') }}
  </SwitchItem>
  <SelectItem
    v-model="headerMode"
    :disabled="!headerEnable"
    :items="localeItems"
  >
    {{ $t('preferences.mode') }}
  </SelectItem>
</template>
