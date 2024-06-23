<script setup lang="ts">
import { ContextMenuGroup, type ContextMenuGroupProps } from 'radix-vue';

const props = defineProps<ContextMenuGroupProps>();
</script>

<template>
  <ContextMenuGroup v-bind="props">
    <slot></slot>
  </ContextMenuGroup>
</template>
