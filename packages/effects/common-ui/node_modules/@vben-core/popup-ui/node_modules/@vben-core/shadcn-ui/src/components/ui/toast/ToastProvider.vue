<script setup lang="ts">
import { ToastProvider, type ToastProviderProps } from 'radix-vue';

const props = defineProps<ToastProviderProps>();
</script>

<template>
  <ToastProvider v-bind="props">
    <slot></slot>
  </ToastProvider>
</template>
