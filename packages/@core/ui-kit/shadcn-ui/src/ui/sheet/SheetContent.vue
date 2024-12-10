<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import {
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';

import { type SheetVariants, sheetVariants } from './sheet';
import SheetOverlay from './SheetOverlay.vue';

interface SheetContentProps extends DialogContentProps {
  appendTo?: HTMLElement | string;
  class?: any;
  modal?: boolean;
  open?: boolean;
  side?: SheetVariants['side'];
  zIndex?: number;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SheetContentProps>(), {
  appendTo: 'body',
  zIndex: 1000,
});

const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const {
    class: _,
    modal: _modal,
    open: _open,
    side: _side,
    ...delegated
  } = props;

  return delegated;
});

function isAppendToBody() {
  return (
    props.appendTo === 'body' ||
    props.appendTo === document.body ||
    !props.appendTo
  );
}

const position = computed(() => {
  return isAppendToBody() ? 'fixed' : 'absolute';
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal :to="appendTo">
    <Transition name="fade">
      <SheetOverlay v-if="open && modal" :style="{ zIndex, position }" />
    </Transition>
    <DialogContent
      :class="cn(sheetVariants({ side }), props.class)"
      :style="{ zIndex, position }"
      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot></slot>

      <!-- <DialogClose
        class="data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
      >
        <Cross2Icon class="h-5 w-" />
      </DialogClose> -->
    </DialogContent>
  </DialogPortal>
</template>
