<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';

import type { SheetVariants } from './sheet';

import { computed, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { DialogContent, useForwardPropsEmits } from 'reka-ui';

import { useDialogStateEvents } from '../dialog/use-dialog-state-events';
import { sheetVariants } from './sheet';
import SheetOverlay from './SheetOverlay.vue';

interface SheetContentProps extends DialogContentProps {
  appendTo?: HTMLElement | string;
  class?: any;
  modal?: boolean;
  open?: boolean;
  overlayBlur?: number;
  side?: SheetVariants['side'];
  zIndex?: number;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SheetContentProps>(), {
  appendTo: 'body',
});

const emits = defineEmits<
  DialogContentEmits & { close: []; closed: []; opened: [] }
>();

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
const contentRef = ref<InstanceType<typeof DialogContent> | null>(null);

const { handleAnimationEvent } = useDialogStateEvents({
  contentRef,
  isOpen: () => props.open,
  onClosed: () => emits('closed'),
  onOpened: () => emits('opened'),
});
</script>

<template>
  <Teleport defer :to="appendTo">
    <Transition name="fade">
      <SheetOverlay
        v-if="open && modal"
        :style="{
          ...(zIndex ? { zIndex } : {}),
          position,
          backdropFilter:
            overlayBlur && overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none',
        }"
      />
    </Transition>
    <DialogContent
      ref="contentRef"
      :class="cn('z-popup', sheetVariants({ side }), props.class)"
      :style="{
        ...(zIndex ? { zIndex } : {}),
        position,
      }"
      @animationend="handleAnimationEvent"
      @animationcancel="handleAnimationEvent"
      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot></slot>

      <!-- <DialogClose
        class="data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none"
      >
        <Cross2Icon class="h-5 w-" />
      </DialogClose> -->
    </DialogContent>
  </Teleport>
</template>
