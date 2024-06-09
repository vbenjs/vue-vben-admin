<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';
import ToggleItem from '../toggle-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

const props = defineProps<{ disabled?: boolean }>();

const breadcrumbEnable = defineModel<boolean>('breadcrumbEnable');
const breadcrumbShowIcon = defineModel<boolean>('breadcrumbShowIcon');
const breadcrumbStyleType = defineModel<string>('breadcrumbStyleType');
const breadcrumbShowHome = defineModel<boolean>('breadcrumbShowHome');
const breadcrumbHideOnlyOne = defineModel<boolean>('breadcrumbHideOnlyOne');

const typeItems: SelectListItem[] = [
  { label: $t('preference.normal'), value: 'normal' },
  { label: $t('preference.breadcrumb-background'), value: 'background' },
];

const disableItem = computed(() => {
  return !breadcrumbEnable.value || props.disabled;
});
</script>

<template>
  <SwitchItem v-model="breadcrumbEnable" :disabled="disabled">
    {{ $t('preference.breadcrumb-enable') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbHideOnlyOne" :disabled="disableItem">
    {{ $t('preference.breadcrumb-hide-only-one') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbShowHome" :disabled="disableItem">
    {{ $t('preference.breadcrumb-home') }}
  </SwitchItem>
  <SwitchItem v-model="breadcrumbShowIcon" :disabled="disableItem">
    {{ $t('preference.breadcrumb-icon') }}
  </SwitchItem>
  <ToggleItem
    v-model="breadcrumbStyleType"
    :disabled="disableItem"
    :items="typeItems"
  >
    {{ $t('preference.breadcrumb-style') }}
  </ToggleItem>
</template>
