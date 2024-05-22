<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const sideVisible = defineModel<boolean>('sideVisible');
const sideCollapseShowTitle = defineModel<boolean>('sideCollapseShowTitle');
const sideCollapse = defineModel<boolean>('sideCollapse');
</script>

<template>
  <SwitchItem v-model="sideVisible" :disabled="disabled">
    {{ $t('preference.side-visible') }}
  </SwitchItem>
  <SwitchItem v-model="sideCollapse" :disabled="!sideVisible || disabled">
    {{ $t('preference.collapse') }}
  </SwitchItem>
  <SwitchItem
    v-model="sideCollapseShowTitle"
    :disabled="!sideVisible || disabled"
  >
    {{ $t('preference.collapse-show-title') }}
  </SwitchItem>
</template>
