<script setup lang="ts">
import { Toaster } from '@vben-core/shadcn-ui';

import { CozeAssistant } from '../coze-assistant';

interface Props {
  enableAiAssistant?: boolean;
  isMobile?: boolean;
}

defineOptions({ name: 'GlobalProvider' });

withDefaults(defineProps<Props>(), {
  enableAiAssistant: false,
  isMobile: false,
});
</script>
<template>
  <Toaster />
  <CozeAssistant v-if="enableAiAssistant" :is-mobile="isMobile" />
  <slot></slot>
</template>
