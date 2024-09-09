<script setup lang="ts">
import { ContextMenuPortal, type ContextMenuPortalProps } from 'radix-vue';

const props = defineProps<ContextMenuPortalProps>();
</script>

<template>
  <ContextMenuPortal v-bind="props">
    <slot></slot>
  </ContextMenuPortal>
</template>
