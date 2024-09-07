<script setup lang="ts">
import { computed, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

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
      class?: any;
      closeClass?: any;
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

const contentRef = ref<InstanceType<typeof DialogContent> | null>(null);

defineExpose({
  getContentRef: () => contentRef.value,
});
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-overlay fixed inset-0 z-[1000]"
      data-dismissable-modal="true"
      @click="() => emits('close')"
    />
    <DialogContent
      ref="contentRef"
      v-bind="forwarded"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] fixed z-[1000] w-full p-6 shadow-lg outline-none sm:rounded-xl',
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
        <Cross2Icon class="h-4 w-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
