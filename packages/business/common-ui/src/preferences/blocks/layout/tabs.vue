<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTabsConfig',
});

defineProps<{ disabled?: boolean }>();

const tabsVisible = defineModel<boolean>('tabsVisible');
const tabsIcon = defineModel<boolean>('tabsIcon');
</script>

<template>
  <SwitchItem v-model="tabsVisible" :disabled="disabled">
    {{ $t('preference.tabs-visible') }}
  </SwitchItem>
  <SwitchItem v-model="tabsIcon" :disabled="!tabsVisible">
    {{ $t('preference.tabs-icon') }}
  </SwitchItem>
  <!-- <SwitchItem v-model="sideCollapseShowTitle" :disabled="!tabsVisible">
    {{ $t('preference.collapse-show-title') }}
  </SwitchItem> -->
</template>
