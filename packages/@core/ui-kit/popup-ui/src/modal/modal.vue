<script lang="ts" setup>
import type { ExtendedModalApi, ModalProps } from './modal';

import { computed, nextTick, ref, watch } from 'vue';

import {
  useIsMobile,
  usePriorityValue,
  useSimpleLocale,
} from '@vben-core/composables';
import { Expand, Info, Shrink } from '@vben-core/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  VbenButton,
  VbenIconButton,
  VbenLoading,
  VbenTooltip,
  VisuallyHidden,
} from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared';

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
const wrapperRef = ref<HTMLElement>();
const dialogRef = ref();
const headerRef = ref();
const footerRef = ref();

const { $t } = useSimpleLocale();
const { isMobile } = useIsMobile();
const state = props.modalApi?.useStore?.();

const header = usePriorityValue('header', props, state);
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
const showCancelButton = usePriorityValue('showCancelButton', props, state);
const showConfirmButton = usePriorityValue('showConfirmButton', props, state);

const shouldFullscreen = computed(
  () => (fullscreen.value && header.value) || isMobile.value,
);

const shouldDraggable = computed(
  () => draggable.value && !shouldFullscreen.value && header.value,
);

const { dragging, transform } = useModalDraggable(
  dialogRef,
  headerRef,
  shouldDraggable,
);

watch(
  () => state?.value?.isOpen,
  async (v) => {
    if (v) {
      await nextTick();
      if (!contentRef.value) return;
      const innerContentRef = contentRef.value.getContentRef();
      dialogRef.value = innerContentRef.$el;
      // reopen modal reassign value
      const { offsetX, offsetY } = transform;
      dialogRef.value.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  },
);

watch(
  () => showLoading.value,
  (v) => {
    if (v && wrapperRef.value) {
      wrapperRef.value.scrollTo({
        // behavior: 'smooth',
        top: 0,
      });
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
    <DialogContent
      ref="contentRef"
      :class="
        cn(
          'border-border left-0 right-0 top-[10vh] mx-auto flex max-h-[80%] w-[520px] flex-col border p-0',
          props.class,
          {
            'left-0 top-0 size-full max-h-full !translate-x-0 !translate-y-0':
              shouldFullscreen,
            'top-1/2 !-translate-y-1/2': centered && !shouldFullscreen,
            'duration-300': !dragging,
          },
        )
      "
      :show-close="closable"
      close-class="top-3"
      @escape-key-down="escapeKeyDown"
      @interact-outside="interactOutside"
      @pointer-down-outside="pointerDownOutside"
    >
      <DialogHeader
        ref="headerRef"
        :class="
          cn(
            'border-b px-5 py-4',
            {
              hidden: !header,
              'cursor-move select-none': shouldDraggable,
            },
            props.headerClass,
          )
        "
      >
        <DialogTitle v-if="title" class="text-left">
          <slot name="title">
            {{ title }}

            <slot v-if="titleTooltip" name="titleTooltip">
              <VbenTooltip side="right">
                <template #trigger>
                  <Info class="inline-flex size-5 cursor-pointer pb-1" />
                </template>
                {{ titleTooltip }}
              </VbenTooltip>
            </slot>
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
        ref="wrapperRef"
        :class="
          cn('relative min-h-40 flex-1 overflow-y-auto p-3', contentClass, {
            'overflow-hidden': showLoading,
          })
        "
      >
        <VbenLoading
          v-if="showLoading"
          class="size-full h-auto min-h-full"
          spinning
        />
        <slot></slot>
      </div>

      <VbenIconButton
        v-if="fullscreenButton"
        class="hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-10 top-3 hidden size-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block"
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
          <VbenButton
            v-if="showCancelButton"
            variant="ghost"
            @click="() => modalApi?.onCancel()"
          >
            <slot name="cancelText">
              {{ cancelText || $t('cancel') }}
            </slot>
          </VbenButton>
          <VbenButton
            v-if="showConfirmButton"
            :loading="confirmLoading"
            @click="() => modalApi?.onConfirm()"
          >
            <slot name="confirmText">
              {{ confirmText || $t('confirm') }}
            </slot>
          </VbenButton>
        </slot>
        <slot name="append-footer"></slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
