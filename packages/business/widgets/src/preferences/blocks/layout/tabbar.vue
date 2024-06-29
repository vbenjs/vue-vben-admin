<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTabsConfig',
});

defineProps<{ disabled?: boolean }>();

const tabbarEnable = defineModel<boolean>('tabbarEnable');
const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon');
</script>

<template>
  <SwitchItem v-model="tabbarEnable" :disabled="disabled">
    {{ $t('preferences.tabbar.enable') }}
  </SwitchItem>
  <SwitchItem v-model="tabbarShowIcon" :disabled="!tabbarEnable">
    {{ $t('preferences.tabbar.icon') }}
  </SwitchItem>
  <!-- <SwitchItem v-model="sideCollapseShowTitle" :disabled="!tabsVisible">
    {{ $t('preferences.collapse-show-title') }}
  </SwitchItem> -->
</template>
