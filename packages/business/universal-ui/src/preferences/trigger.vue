<script setup lang="ts">
import { $t } from '@vben/locales';
import { VbenButton } from '@vben-core/shadcn-ui';

import IconSetting from './icons/setting.vue';

defineOptions({
  name: 'PreferenceTrigger',
});
</script>

<template>
  <VbenButton
    :title="$t('preferences.name')"
    class="bg-primary flex-col-center h-12 w-12 cursor-pointer rounded-l-lg rounded-r-none border-none"
  >
    <IconSetting class="duration-3000 animate-spin text-2xl" />
  </VbenButton>
</template>
