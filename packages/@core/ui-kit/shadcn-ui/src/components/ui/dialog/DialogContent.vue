<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import { Cross2Icon } from '@radix-icons/vue';
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      showClose?: boolean;
    } & DialogContentProps
  >(),
  { showClose: true },
);
const emits = defineEmits<{ close: [] } & DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, showClose: __, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-overlay fixed inset-0 z-[1000] backdrop-blur-sm"
      @click="() => emits('close')"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] border-border fixed left-1/2 top-1/2 z-[1000] grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg outline-none duration-300 sm:rounded-lg',
          props.class,
        )
      "
    >
      <slot></slot>

      <DialogClose
        v-if="showClose"
        class="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-accent hover:text-accent-foreground text-foreground/80 flex-center absolute right-3 top-3 h-6 w-6 rounded-full px-1 text-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        @click="() => emits('close')"
      >
        <Cross2Icon class="h-4 w-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
