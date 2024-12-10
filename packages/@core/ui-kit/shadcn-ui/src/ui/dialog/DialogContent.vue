<script setup lang="ts">
import type { ClassType } from '@vben-core/typings';

import { computed, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { X } from 'lucide-vue-next';
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';

import DialogOverlay from './DialogOverlay.vue';

const props = withDefaults(
  defineProps<
    {
      appendTo?: HTMLElement | string;
      class?: ClassType;
      closeClass?: ClassType;
      modal?: boolean;
      open?: boolean;
      showClose?: boolean;
      zIndex?: number;
    } & DialogContentProps
  >(),
  { appendTo: 'body', showClose: true, zIndex: 1000 },
);
const emits = defineEmits<
  { close: []; closed: []; opened: [] } & DialogContentEmits
>();

const delegatedProps = computed(() => {
  const {
    class: _,
    modal: _modal,
    open: _open,
    showClose: __,
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
function onAnimationEnd(event: AnimationEvent) {
  // 只有在 contentRef 的动画结束时才触发 opened/closed 事件
  if (event.target === contentRef.value?.$el) {
    if (props.open) {
      emits('opened');
    } else {
      emits('closed');
    }
  }
}
defineExpose({
  getContentRef: () => contentRef.value,
});
</script>

<template>
  <DialogPortal :to="appendTo">
    <Transition name="fade">
      <DialogOverlay
        v-if="open && modal"
        :style="{ zIndex, position }"
        @click="() => emits('close')"
      />
    </Transition>
    <DialogContent
      ref="contentRef"
      :style="{ zIndex, position }"
      @animationend="onAnimationEnd"
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] w-full p-6 shadow-lg outline-none sm:rounded-xl',
          props.class,
        )
      "
    >
      <slot></slot>

      <DialogClose
        v-if="showClose"
        :class="
          cn(
            'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-3 top-3 h-6 w-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none',
            props.closeClass,
          )
        "
        @click="() => emits('close')"
      >
        <X class="h-4 w-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
