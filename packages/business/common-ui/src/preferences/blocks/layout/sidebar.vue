<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

defineProps<{ disabled: boolean }>();

const sidebarEnable = defineModel<boolean>('sidebarEnable');
const sidebarCollapsedShowTitle = defineModel<boolean>(
  'sidebarCollapsedShowTitle',
);
const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed');
</script>

<template>
  <SwitchItem v-model="sidebarEnable" :disabled="disabled">
    {{ $t('preference.side-visible') }}
  </SwitchItem>
  <SwitchItem v-model="sidebarCollapsed" :disabled="!sidebarEnable || disabled">
    {{ $t('preference.collapse') }}
  </SwitchItem>
  <SwitchItem
    v-model="sidebarCollapsedShowTitle"
    :disabled="!sidebarEnable || disabled"
  >
    {{ $t('preference.collapse-show-title') }}
  </SwitchItem>
</template>
