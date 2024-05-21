<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';
import ToggleItem from '../toggle-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const breadcrumbVisible = defineModel<boolean>('breadcrumbVisible');
const breadcrumbIcon = defineModel<boolean>('breadcrumbIcon');
const breadcrumbStyle = defineModel<string>('breadcrumbStyle');
const breadcrumbHome = defineModel<boolean>('breadcrumbHome');
const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne');

const typeItems: SelectListItem[] = [
  { label: $t('preference.normal'), value: 'normal' },
  { label: $t('preference.breadcrumb-background'), value: 'background' },
];
</script>

<template>
  <SwitchItem v-model="breadcrumbVisible" :disabled="disabled">
    {{ $t('preference.breadcrumb-enable') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbHideOnlyOne" :disabled="!breadcrumbVisible">
    {{ $t('preference.breadcrumb-hide-only-one') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbHome" :disabled="!breadcrumbVisible">
    {{ $t('preference.breadcrumb-home') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbIcon" :disabled="!breadcrumbVisible">
    {{ $t('preference.breadcrumb-icon') }}
  </SwitchItem>
  <ToggleItem
    v-model="breadcrumbStyle"
    :items="typeItems"
    :disabled="!breadcrumbVisible"
  >
    {{ $t('preference.breadcrumb-style') }}
  </ToggleItem>
</template>
