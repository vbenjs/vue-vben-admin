<script setup lang="ts">
import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

const copyrightEnable = defineModel<boolean>('copyrightEnable');
</script>

<template>
  <SwitchItem v-model="copyrightEnable">
    {{ $t('preferences.copyright.enable') }}
  </SwitchItem>
</template>
