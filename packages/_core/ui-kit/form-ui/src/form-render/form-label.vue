<script setup lang="ts">
import { FormLabel, VbenHelpTooltip } from '@vben-core/shadcn-ui';

interface Props {
  help?: string;
  required?: boolean;
}

defineProps<Props>();
</script>

<template>
  <FormLabel class="flex flex-row-reverse items-center">
    <VbenHelpTooltip v-if="help" trigger-class="size-3.5 ml-1">
      {{ help }}
    </VbenHelpTooltip>
    <slot></slot>
    <span v-if="required" class="text-destructive mr-[2px]">*</span>
  </FormLabel>
</template>
