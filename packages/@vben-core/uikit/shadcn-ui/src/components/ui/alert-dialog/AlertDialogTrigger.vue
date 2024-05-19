<script setup lang="ts">
import { AlertDialogTrigger, type AlertDialogTriggerProps } from 'radix-vue';

const props = defineProps<AlertDialogTriggerProps>();
</script>

<template>
  <AlertDialogTrigger v-bind="props">
    <slot></slot>
  </AlertDialogTrigger>
</template>
