<script setup lang="ts">
import type { AlertDialogContentEmits, AlertDialogContentProps } from 'reka-ui';

import type { ClassType } from '@vben-core/typings';

import { ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import {
  AlertDialogContent,
  AlertDialogPortal,
  useForwardPropsEmits,
} from 'reka-ui';

import AlertDialogOverlay from './AlertDialogOverlay.vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    AlertDialogContentProps & {
      centered?: boolean;
      class?: ClassType;
      modal?: boolean;
      open?: boolean;
      overlayBlur?: number;
      zIndex?: number;
    }
  >(),
  { modal: true },
);
const emits = defineEmits<
  AlertDialogContentEmits & { close: []; closed: []; opened: [] }
>();

// reka-ui 的 AlertDialog 在 modal=true 时会将 body 设置 pointer-events:none，
// 弹出层（如 Select 下拉框）会因此无法点击。这里通过在上层传入 :modal="false" 来
// 避免该问题，同时通过 AlertDialogOverlay 组件自行渲染遮罩并锁定滚动。
// AlertDialogOverlay 通过 v-if 控制挂载/卸载，其内部的 useScrollLock 会在组件
// 卸载时自动解锁滚动。

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const contentRef = ref<InstanceType<typeof AlertDialogContent> | null>(null);
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
  <AlertDialogPortal>
    <Transition name="fade" appear>
      <AlertDialogOverlay
        v-if="open && modal"
        :overlay-blur="overlayBlur"
        position="fixed"
        :z-index="zIndex"
        @click="() => emits('close')"
      />
    </Transition>
    <AlertDialogContent
      data-slot="alert-dialog-content"
      ref="contentRef"
      :style="{ ...(zIndex ? { zIndex } : {}), position: 'fixed' }"
      @animationend="onAnimationEnd"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'z-popup bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          {
            'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]':
              !centered,
            'data-[state=closed]:slide-out-to-top-[148%] data-[state=open]:slide-in-from-top-[98%]':
              centered,
            'top-[10vh]': !centered,
            'top-1/2 -translate-y-1/2': centered,
          },
          props.class,
        )
      "
    >
      <slot></slot>
    </AlertDialogContent>
  </AlertDialogPortal>
</template>
