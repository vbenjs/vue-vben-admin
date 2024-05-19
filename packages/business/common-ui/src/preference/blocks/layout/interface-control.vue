<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceInterfaceControl',
});

const tabsVisible = defineModel<boolean>('tabsVisible');
const logoVisible = defineModel<boolean>('logoVisible');
</script>

<template>
  <SwitchItem v-model="tabsVisible">
    {{ $t('preference.tabs-visible') }}
  </SwitchItem>
  <SwitchItem v-model="logoVisible">
    {{ $t('preference.logo-visible') }}
  </SwitchItem>
</template>
