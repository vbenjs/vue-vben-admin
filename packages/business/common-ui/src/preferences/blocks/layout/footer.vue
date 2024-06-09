<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

const footerEnable = defineModel<boolean>('footerEnable');
const footerFixed = defineModel<boolean>('footerFixed');
</script>

<template>
  <SwitchItem v-model="footerEnable">
    {{ $t('preference.footer-visible') }}
  </SwitchItem>
  <SwitchItem v-model="footerFixed" :disabled="!footerEnable">
    {{ $t('preference.footer-fixed') }}
  </SwitchItem>
</template>
