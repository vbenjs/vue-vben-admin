<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed, ref, useTemplateRef } from 'vue';

import { Check, ChevronsRight } from '@vben/icons';

import { Slot } from '@vben-core/shadcn-ui';

const props = defineProps<{
  actionStyle: CSSProperties;
  isPassing: boolean;
  toLeft: boolean;
}>();

const actionRef = useTemplateRef<HTMLDivElement>('actionRef');

const left = ref('0');

const style = computed(() => {
  const { actionStyle } = props;
  return {
    ...actionStyle,
    left: left.value,
  };
});

const isDragging = computed(() => {
  const currentLeft = Number.parseInt(left.value as string);

  return currentLeft > 10 && !props.isPassing;
});

defineExpose({
  getEl: () => {
    return actionRef.value;
  },
  getStyle: () => {
    return actionRef?.value?.style;
  },
  setLeft: (val: string) => {
    left.value = val;
  },
});
</script>

<template>
  <div
    ref="actionRef"
    :class="{
      'transition-width left-0! duration-300': toLeft,
      'rounded-md': isDragging,
    }"
    :style="style"
    class="absolute top-0 left-0 flex-center h-full cursor-move bg-background px-3.5 shadow-md dark:bg-accent"
    name="captcha-action"
  >
    <Slot :is-passing="isPassing" class="size-4 text-foreground/60">
      <slot name="icon">
        <ChevronsRight v-if="!isPassing" />
        <Check v-else />
      </slot>
    </Slot>
  </div>
</template>
