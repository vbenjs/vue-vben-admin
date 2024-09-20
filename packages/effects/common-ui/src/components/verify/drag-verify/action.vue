<script setup lang="ts">
import { computed, type CSSProperties, ref } from 'vue';

import { Check, ChevronsRight } from '@vben/icons';

const props = defineProps<{
  actionStyle: CSSProperties;
  height: number | string;
  isPassing: boolean;
  toLeft: boolean;
}>();
const divRef = ref<HTMLDivElement>();

const left = ref('0px');
const style = computed(() => {
  const { actionStyle, height } = props;
  const h = `${Number.parseInt(height as string)}px`;
  return {
    background: 'hsl(var(--background))',
    height: h,
    left: left.value,
    width: h,
    ...actionStyle,
  };
});

defineExpose({
  getEl: () => {
    return divRef.value;
  },
  getStyle: () => {
    return divRef.value && divRef.value && divRef.value.style;
  },
  setLeft: (val: string) => {
    left.value = val;
  },
});
</script>

<template>
  <div
    ref="divRef"
    :class="toLeft ? 'transition-width !left-0 duration-300' : ''"
    :style="style"
    class="absolute left-0 top-0 flex cursor-move items-center justify-center rounded-md"
  >
    <slot v-if="$slots.icon" name="icon"></slot>

    <template v-else>
      <ChevronsRight v-if="!isPassing" />
      <Check v-else />
    </template>
  </div>
</template>
