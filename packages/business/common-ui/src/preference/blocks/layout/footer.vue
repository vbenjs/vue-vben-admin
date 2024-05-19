<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

const footerVisible = defineModel<boolean>('footerVisible');
const footerFixed = defineModel<boolean>('footerFixed');
</script>

<template>
  <SwitchItem v-model="footerVisible">
    {{ $t('preference.footer-visible') }}
  </SwitchItem>
  <SwitchItem v-model="footerFixed" :disabled="!footerVisible">
    {{ $t('preference.footer-fixed') }}
  </SwitchItem>
</template>
