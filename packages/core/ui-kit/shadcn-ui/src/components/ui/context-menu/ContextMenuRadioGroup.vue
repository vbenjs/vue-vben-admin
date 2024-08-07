<script setup lang="ts">
import {
  ContextMenuRadioGroup,
  type ContextMenuRadioGroupEmits,
  type ContextMenuRadioGroupProps,
  useForwardPropsEmits,
} from 'radix-vue';

const props = defineProps<ContextMenuRadioGroupProps>();
const emits = defineEmits<ContextMenuRadioGroupEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <ContextMenuRadioGroup v-bind="forwarded">
    <slot></slot>
  </ContextMenuRadioGroup>
</template>
