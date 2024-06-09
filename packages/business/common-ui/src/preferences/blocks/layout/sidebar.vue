<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const sidebarEnable = defineModel<boolean>('sidebarEnable');
const sidebarCollapseShowTitle = defineModel<boolean>(
  'sidebarCollapseShowTitle',
);
const sidebarCollapse = defineModel<boolean>('sidebarCollapse');
</script>

<template>
  <SwitchItem v-model="sidebarEnable" :disabled="disabled">
    {{ $t('preference.side-visible') }}
  </SwitchItem>
  <SwitchItem v-model="sidebarCollapse" :disabled="!sidebarEnable || disabled">
    {{ $t('preference.collapse') }}
  </SwitchItem>
  <SwitchItem
    v-model="sidebarCollapseShowTitle"
    :disabled="!sidebarEnable || disabled"
  >
    {{ $t('preference.collapse-show-title') }}
  </SwitchItem>
</template>
