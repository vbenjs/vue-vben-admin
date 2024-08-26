<script lang="ts" setup>
import type { ExtendedModalApi, ModalProps } from './modal';

import { computed, nextTick, ref, watch } from 'vue';

import { useIsMobile, usePriorityValue } from '@vben-core/composables';
import { Expand, Info, Shrink } from '@vben-core/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  VbenButton,
  VbenIconButton,
  VbenLoading,
  VbenTooltip,
  VisuallyHidden,
} from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared';

// import { useElementSize } from '@vueuse/core';

import { useModalDraggable } from './use-modal-draggable';

interface Props extends ModalProps {
  class?: string;
  contentClass?: string;
  footerClass?: string;
  headerClass?: string;
  modalApi?: ExtendedModalApi;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  contentClass: '',
  footerClass: '',
  headerClass: '',
  modalApi: undefined,
});

const contentRef = ref();
const dialogRef = ref();
const headerRef = ref();
const footerRef = ref();

const { isMobile } = useIsMobile();
// const { height: headerHeight } = useElementSize(headerRef);
// const { height: footerHeight } = useElementSize(footerRef);
const state = props.modalApi?.useStore?.();

const title = usePriorityValue('title', props, state);
const fullscreen = usePriorityValue('fullscreen', props, state);
const description = usePriorityValue('description', props, state);
const titleTooltip = usePriorityValue('titleTooltip', props, state);
const showFooter = usePriorityValue('footer', props, state);
const showLoading = usePriorityValue('loading', props, state);
const closable = usePriorityValue('closable', props, state);
const modal = usePriorityValue('modal', props, state);
const centered = usePriorityValue('centered', props, state);
const confirmLoading = usePriorityValue('confirmLoading', props, state);
const cancelText = usePriorityValue('cancelText', props, state);
const confirmText = usePriorityValue('confirmText', props, state);
const draggable = usePriorityValue('draggable', props, state);
const fullscreenButton = usePriorityValue('fullscreenButton', props, state);
const closeOnClickModal = usePriorityValue('closeOnClickModal', props, state);
const closeOnPressEscape = usePriorityValue('closeOnPressEscape', props, state);

const shouldFullscreen = computed(() => fullscreen.value || isMobile.value);
const shouldDraggable = computed(
  () => draggable.value && !shouldFullscreen.value,
);

const { dragging } = useModalDraggable(dialogRef, headerRef, shouldDraggable);

// const loadingStyle = computed(() => {
//   // py-5 4px*5*2
//   const headerPadding = 40;
//   // p-2 4px*2*2
//   const footerPadding = 16;

//   return {
//     bottom: `${footerHeight.value + footerPadding}px`,
//     height: `calc(100% - ${footerHeight.value + headerHeight.value + headerPadding + footerPadding}px)`,
//     top: `${headerHeight.value + headerPadding}px`,
//   };
// });

watch(
  () => state?.value?.isOpen,
  async (v) => {
    if (v) {
      await nextTick();
      if (contentRef.value) {
        const innerContentRef = contentRef.value.getContentRef();
        dialogRef.value = innerContentRef.$el;
      }
    }
  },
);

function handleFullscreen() {
  props.modalApi?.setState((prev) => {
    // if (prev.fullscreen) {
    //   resetPosition();
    // }
    return { ...prev, fullscreen: !fullscreen.value };
  });
}
function interactOutside(e: Event) {
  if (!closeOnClickModal.value) {
    e.preventDefault();
  }
}
function escapeKeyDown(e: KeyboardEvent) {
  if (!closeOnPressEscape.value) {
    e.preventDefault();
  }
}
// pointer-down-outside
function pointerDownOutside(e: Event) {
  const target = e.target as HTMLElement;
  const isDismissableModal = !!target?.dataset.dismissableModal;
  if (!closeOnClickModal.value || !isDismissableModal) {
    e.preventDefault();
  }
}
</script>
<template>
  <Dialog
    :modal="modal"
    :open="state?.isOpen"
    @update:open="() => modalApi?.close()"
  >
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger"> </slot>
    </DialogTrigger>

    <DialogContent
      ref="contentRef"
      :class="
        cn(
          'left-0 right-0 top-[10vh] mx-auto flex max-h-[80%] w-[520px] flex-col p-0',
          props.class,
          {
            'left-0 top-0 size-full max-h-full !translate-x-0 !translate-y-0':
              shouldFullscreen,
            'top-1/2 -translate-y-1/2': centered && !shouldFullscreen,
            'duration-300': !dragging,
          },
        )
      "
      :show-close="closable"
      close-class="top-4"
      @escape-key-down="escapeKeyDown"
      @interact-outside="interactOutside"
      @pointer-down-outside="pointerDownOutside"
    >
      <DialogHeader
        ref="headerRef"
        :class="
          cn(
            'border-b px-6 py-5',
            {
              'cursor-move select-none': shouldDraggable,
            },
            props.headerClass,
          )
        "
      >
        <DialogTitle v-if="title" class="text-left">
          <slot name="title">
            {{ title }}

            <VbenTooltip v-if="titleTooltip" side="right">
              <template #trigger>
                <Info class="inline-flex size-5 cursor-pointer pb-1" />
              </template>
              {{ titleTooltip }}
            </VbenTooltip>
          </slot>
        </DialogTitle>
        <DialogDescription v-if="description">
          <slot name="description">
            {{ description }}
          </slot>
        </DialogDescription>
        <VisuallyHidden v-if="!title || !description">
          <DialogTitle v-if="!title" />
          <DialogDescription v-if="!description" />
        </VisuallyHidden>
      </DialogHeader>
      <div
        :class="
          cn('relative min-h-40 flex-1 p-3', contentClass, {
            'overflow-y-auto': !showLoading,
          })
        "
      >
        <VbenLoading v-if="showLoading" class="size-full" spinning />
        <slot></slot>
      </div>

      <VbenIconButton
        v-if="fullscreenButton"
        class="hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-10 top-4 hidden size-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block"
        @click="handleFullscreen"
      >
        <Shrink v-if="fullscreen" class="size-3.5" />
        <Expand v-else class="size-3.5" />
      </VbenIconButton>

      <DialogFooter
        v-if="showFooter"
        ref="footerRef"
        :class="
          cn(
            'flex-row items-center justify-end border-t p-2',
            props.footerClass,
          )
        "
      >
        <slot name="prepend-footer"></slot>
        <slot name="footer">
          <VbenButton variant="ghost" @click="() => modalApi?.onCancel()">
            <slot name="cancelText">
              {{ cancelText }}
            </slot>
          </VbenButton>
          <VbenButton
            :loading="confirmLoading"
            @click="() => modalApi?.onConfirm()"
          >
            <slot name="confirmText">
              {{ confirmText }}
            </slot>
          </VbenButton>
        </slot>
        <slot name="append-footer"></slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
