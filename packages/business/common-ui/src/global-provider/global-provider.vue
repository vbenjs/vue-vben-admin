<script setup lang="ts">
import { preferences } from '@vben-core/preferences';
import { Toaster } from '@vben-core/shadcn-ui';

import { CozeAssistant } from '../coze-assistant';

defineOptions({ name: 'GlobalProvider' });
</script>
<template>
  <Toaster />
  <CozeAssistant
    v-if="preferences.app.aiAssistant"
    :is-mobile="preferences.app.isMobile"
  />
  <slot></slot>
</template>
