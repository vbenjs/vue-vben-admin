<script setup lang="ts">
import type { SplitterPanelEmits, SplitterPanelProps } from 'reka-ui';

import { ref } from 'vue';

import { SplitterPanel, useForwardPropsEmits } from 'reka-ui';

const props = defineProps<SplitterPanelProps>();
const emits = defineEmits<SplitterPanelEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const panelRef = ref<InstanceType<typeof SplitterPanel>>();

defineExpose({
  collapse: () => panelRef.value?.collapse(),
  expand: () => panelRef.value?.expand(),
  getSize: () => panelRef.value?.getSize(),
  resize: (size: number) => panelRef.value?.resize(size),
});
</script>

<template>
  <SplitterPanel
    ref="panelRef"
    v-slot="slotProps"
    data-slot="resizable-panel"
    v-bind="forwarded"
  >
    <slot v-bind="slotProps"></slot>
  </SplitterPanel>
</template>
