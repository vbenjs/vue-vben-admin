<script lang="ts" setup>
import type { DrawerProps, ExtendedDrawerApi } from './drawer';

import { usePriorityValue } from '@vben-core/composables';
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
</script>
<template>
  <Sheet
    :modal="modal"
    :open="state?.isOpen"
    @update:open="() => drawerApi?.close()"
  >
    <template #trigger>
      <slot name="trigger"> </slot>
    </template>
    <SheetContent :class="cn('flex w-[520px] flex-col', props.class, {})">
      <SheetHeader
        :class="
          cn('!flex flex-row items-center justify-between border-b px-6 py-5', {
            'px-4 py-3': closable,
          })
        "
      >
        <SheetTitle v-if="title">
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
        <SheetDescription v-if="description">
          <slot name="description">
            {{ description }}
          </slot>
        </SheetDescription>

        <VisuallyHidden v-if="!title || !description">
          <SheetTitle v-if="!title" />
          <SheetDescription v-if="!description" />
        </VisuallyHidden>

        <div class="flex-center gap-x-2">
          <slot name="extra"></slot>
          <SheetClose
            v-if="closable"
            as-child
            class="data-[state=open]:bg-secondary cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <VbenIconButton>
              <X class="size-4" />
            </VbenIconButton>
          </SheetClose>
        </div>
      </SheetHeader>

      <div
        :class="
          cn('relative flex-1 p-3', contentClass, {
            'overflow-y-auto': !showLoading,
          })
        "
      >
        <VbenLoading v-if="showLoading" class="size-full" spinning />
        <slot></slot>
      </div>

      <SheetFooter
        v-if="showFooter"
        class="w-full items-center border-t p-2 px-3"
      >
        <slot name="prepend-footer"></slot>
        <slot name="footer">
          <VbenButton
            size="sm"
            variant="ghost"
            @click="() => drawerApi?.onCancel()"
          >
            <slot name="cancelText">
              {{ cancelText }}
            </slot>
          </VbenButton>
          <VbenButton
            :loading="confirmLoading"
            size="sm"
            @click="() => drawerApi?.onConfirm()"
          >
            <slot name="confirmText">
              {{ confirmText }}
            </slot>
          </VbenButton>
        </slot>
        <slot name="append-footer"></slot>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
