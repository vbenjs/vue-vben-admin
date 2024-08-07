<script setup lang="ts">
import { computed, useSlots } from 'vue';

import {
  VbenButton,
  VbenIconButton,
} from '@vben-core/shadcn-ui/components/button';
import { VbenScrollbar } from '@vben-core/shadcn-ui/components/scrollbar';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@vben-core/shadcn-ui/components/ui/sheet';

import { X } from 'lucide-vue-next';

interface Props {
  cancelText?: string;
  description?: string;
  showFooter?: boolean;
  submitText?: string;
  title?: string;
  width?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '关闭',
  description: '',
  showFooter: false,
  submitText: '确认',
  title: '',
  width: 400,
});

const emits = defineEmits<{
  cancel: [];
  submit: [];
}>();

const openModal = defineModel<boolean>('open');

const slots = useSlots();

const contentStyle = computed(() => {
  return {
    width: `${props.width}px`,
  };
});

function handlerSubmit() {
  emits('submit');
  openModal.value = false;
}

// function handleCancel() {
//   emits('cancel');
//   openModal.value = false;
// }
</script>

<template>
  <Sheet v-model:open="openModal">
    <SheetTrigger>
      <slot name="trigger"></slot>
    </SheetTrigger>
    <SheetContent :style="contentStyle" class="!w-full pb-12 sm:rounded-l-lg">
      <SheetHeader
        :class="description ? 'h-16' : 'h-12'"
        class="border-border flex flex-row items-center justify-between border-b pl-3 pr-3"
      >
        <div class="flex w-full items-center justify-between">
          <div>
            <SheetTitle class="text-left text-lg">{{ title }}</SheetTitle>
            <SheetDescription class="text-muted-foreground text-xs">
              {{ description }}
            </SheetDescription>
          </div>
          <slot v-if="slots.extra" name="extra"></slot>
        </div>
        <SheetClose
          as-child
          class="data-[state=open]:bg-secondary cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <VbenIconButton>
            <X class="size-4" />
          </VbenIconButton>
        </SheetClose>
      </SheetHeader>
      <div class="h-full pb-16">
        <VbenScrollbar class="h-full" shadow>
          <slot></slot>
        </VbenScrollbar>
      </div>
      <SheetFooter v-if="showFooter || slots.footer" as-child>
        <div
          class="border-border absolute bottom-0 flex h-12 w-full items-center justify-end border-t"
        >
          <slot v-if="slots.footer" name="footer"></slot>
          <template v-else>
            <SheetClose as-child>
              <VbenButton class="mr-2" variant="outline">
                {{ cancelText }}
              </VbenButton>
            </SheetClose>
            <VbenButton @click="handlerSubmit">{{ submitText }}</VbenButton>
          </template>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
