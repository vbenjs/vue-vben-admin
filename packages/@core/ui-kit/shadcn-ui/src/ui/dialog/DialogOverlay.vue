<script setup lang="ts">
import type { DialogOverlayProps } from 'reka-ui';

import { DialogOverlay } from 'reka-ui';

const props = defineProps<DialogOverlayProps>();
</script>

<template>
  <DialogOverlay data-slot="dialog-overlay" v-bind="props">
    <slot></slot>
  </DialogOverlay>
</template>
