<script setup lang="ts">
import { Toaster } from '@vben-core/shadcn-ui';

defineOptions({ name: 'GlobalProvider' });
</script>
<template>
  <Toaster />
  <slot></slot>
</template>
