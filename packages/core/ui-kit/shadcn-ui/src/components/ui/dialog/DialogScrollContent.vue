<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & DialogContentProps
>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 border-border fixed inset-0 z-[1000] grid place-items-center overflow-y-auto bg-black/80"
    >
      <DialogContent
        :class="
          cn(
            'border-border bg-background relative z-50 my-8 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
            props.class,
          )
        "
        v-bind="forwarded"
        @pointer-down-outside="
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const target = originalEvent.target as HTMLElement;
            if (
              originalEvent.offsetX > target.clientWidth ||
              originalEvent.offsetY > target.clientHeight
            ) {
              event.preventDefault();
            }
          }
        "
      >
        <slot></slot>

        <DialogClose
          class="hover:bg-secondary absolute right-4 top-4 rounded-md p-0.5 transition-colors"
        >
          <Cross2Icon class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogOverlay>
  </DialogPortal>
</template>
