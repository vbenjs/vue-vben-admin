<script lang="ts" setup>
import type { DrawerProps, ExtendedDrawerApi } from './drawer';

import { ref, watch } from 'vue';

import {
  useIsMobile,
  usePriorityValue,
  useSimpleLocale,
} from '@vben-core/composables';
import { Info, X } from '@vben-core/icons';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  VbenButton,
  VbenIconButton,
  VbenLoading,
  VbenTooltip,
  VisuallyHidden,
} from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared';

interface Props extends DrawerProps {
  class?: string;
  contentClass?: string;
  drawerApi?: ExtendedDrawerApi;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  contentClass: '',
  drawerApi: undefined,
});

const wrapperRef = ref<HTMLElement>();
const { $t } = useSimpleLocale();
const { isMobile } = useIsMobile();
const state = props.drawerApi?.useStore?.();

const title = usePriorityValue('title', props, state);
const description = usePriorityValue('description', props, state);
const titleTooltip = usePriorityValue('titleTooltip', props, state);
const showFooter = usePriorityValue('footer', props, state);
const showLoading = usePriorityValue('loading', props, state);
const closable = usePriorityValue('closable', props, state);
const modal = usePriorityValue('modal', props, state);
const confirmLoading = usePriorityValue('confirmLoading', props, state);
const cancelText = usePriorityValue('cancelText', props, state);
const confirmText = usePriorityValue('confirmText', props, state);
const closeOnClickModal = usePriorityValue('closeOnClickModal', props, state);
const closeOnPressEscape = usePriorityValue('closeOnPressEscape', props, state);
const showCancelButton = usePriorityValue('showCancelButton', props, state);
const showConfirmButton = usePriorityValue('showConfirmButton', props, state);

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
  <Sheet
    :modal="modal"
    :open="state?.isOpen"
    @update:open="() => drawerApi?.close()"
  >
    <SheetContent
      :class="
        cn('flex w-[520px] flex-col', props.class, {
          '!w-full': isMobile,
        })
      "
      @escape-key-down="escapeKeyDown"
      @interact-outside="interactOutside"
      @pointer-down-outside="pointerDownOutside"
    >
      <SheetHeader
        :class="
          cn('!flex flex-row items-center justify-between border-b px-6 py-5', {
            'px-4 py-3': closable,
          })
        "
      >
        <div>
          <SheetTitle v-if="title" class="text-left">
            <slot name="title">
              {{ title }}

              <VbenTooltip v-if="titleTooltip" side="right">
                <template #trigger>
                  <Info class="inline-flex size-5 cursor-pointer pb-1" />
                </template>
                {{ titleTooltip }}
              </VbenTooltip>
            </slot>
          </SheetTitle>
          <SheetDescription v-if="description" class="mt-1 text-xs">
            <slot name="description">
              {{ description }}
            </slot>
          </SheetDescription>
        </div>

        <VisuallyHidden v-if="!title || !description">
          <SheetTitle v-if="!title" />
          <SheetDescription v-if="!description" />
        </VisuallyHidden>

        <div class="flex-center">
          <slot name="extra"></slot>
          <SheetClose
            v-if="closable"
            as-child
            class="data-[state=open]:bg-secondary ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <VbenIconButton>
              <X class="size-4" />
            </VbenIconButton>
          </SheetClose>
        </div>
      </SheetHeader>

      <div
        ref="wrapperRef"
        :class="
          cn('relative flex-1 overflow-y-auto p-3', contentClass, {
            'overflow-hidden': showLoading,
          })
        "
      >
        <VbenLoading v-if="showLoading" class="size-full" spinning />

        <slot></slot>
      </div>

      <SheetFooter
        v-if="showFooter"
        class="w-full flex-row items-center justify-end border-t p-2 px-3"
      >
        <slot name="prepend-footer"></slot>
        <slot name="footer">
          <VbenButton
            v-if="showCancelButton"
            variant="ghost"
            @click="() => drawerApi?.onCancel()"
          >
            <slot name="cancelText">
              {{ cancelText || $t('cancel') }}
            </slot>
          </VbenButton>
          <VbenButton
            v-if="showConfirmButton"
            :loading="confirmLoading"
            @click="() => drawerApi?.onConfirm()"
          >
            <slot name="confirmText">
              {{ confirmText || $t('confirm') }}
            </slot>
          </VbenButton>
        </slot>
        <slot name="append-footer"></slot>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
