<script setup lang="ts">
import type { ContextMenuRootEmits, ContextMenuRootProps } from 'radix-vue';

import { ContextMenuRoot, useForwardPropsEmits } from 'radix-vue';

const props = defineProps<ContextMenuRootProps>();
const emits = defineEmits<ContextMenuRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <ContextMenuRoot v-bind="forwarded">
    <slot></slot>
  </ContextMenuRoot>
</template>
