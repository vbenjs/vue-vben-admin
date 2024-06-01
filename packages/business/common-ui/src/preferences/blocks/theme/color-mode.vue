<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceColorMode',
});

const colorWeakMode = defineModel<boolean>('colorWeakMode', {
  default: false,
});

const colorGrayMode = defineModel<boolean>('colorGrayMode', {
  default: false,
});
</script>

<template>
  <SwitchItem v-model="colorWeakMode">
    {{ $t('preference.weak-mode') }}
  </SwitchItem>
  <SwitchItem v-model="colorGrayMode">
    {{ $t('preference.gray-mode') }}
  </SwitchItem>
</template>
