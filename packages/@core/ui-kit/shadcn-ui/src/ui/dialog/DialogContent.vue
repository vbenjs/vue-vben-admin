<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import type { ClassType } from '@vben-core/typings';

import { computed, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { X } from '@lucide/vue';
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui';

import DialogOverlay from './DialogOverlay.vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      animationType?: 'scale' | 'slide';
      appendTo?: HTMLElement | string;
      class?: HTMLAttributes['class'];
      closeClass?: ClassType;
      closeDisabled?: boolean;
      modal?: boolean;
      open?: boolean;
      overlayBlur?: number;
      showCloseButton?: boolean;
      zIndex?: number;
    }
  >(),
  {
    appendTo: 'body',
    animationType: 'slide',
    closeDisabled: false,
    showCloseButton: true,
  },
);
const emits = defineEmits<
  DialogContentEmits & { close: []; closed: []; opened: [] }
>();

const delegatedProps = computed(() => {
  const {
    class: _,
    modal: _modal,
    open: _open,
    showCloseButton: __,
    animationType: ___,
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

// reka-ui 的 Dialog 在 modal=false 时不会渲染遮罩，这里通过 DialogOverlay 组件自行渲染遮罩层并锁定滚动。
// DialogOverlay 组件通过 v-if 控制挂载/卸载，其内部的 useScrollLock 会在组件卸载时自动解锁滚动，
// 避免 modal=true 时 body 被设置 pointer-events:none 导致弹出层（如 Select 下拉框）无法点击的问题。

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
        :overlay-blur="overlayBlur"
        :position="position"
        :z-index="zIndex"
        @click="() => emits('close')"
      />
    </Transition>
    <DialogContent
      ref="contentRef"
      :style="{ ...(zIndex ? { zIndex } : {}), position }"
      data-slot="dialog-content"
      @animationend="onAnimationEnd"
      v-bind="forwarded"
      :class="
        cn(
          'z-popup bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-full p-6 shadow-lg outline-hidden sm:rounded-xl',
          {
            'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]':
              animationType === 'slide',
          },
          props.class,
        )
      "
    >
      <slot></slot>

      <DialogClose
        v-if="showCloseButton"
        :disabled="closeDisabled"
        data-slot="dialog-close"
        :class="
          cn(
            'flex-center text-foreground/80 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-3 right-3 h-6 w-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none',
            props.closeClass,
          )
        "
        @click="() => emits('close')"
      >
        <X class="size-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
