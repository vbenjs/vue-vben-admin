<script setup lang="ts">
import type { ContextMenuContentEmits, ContextMenuContentProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import {
  ContextMenuContent,
  ContextMenuPortal,
  useForwardPropsEmits,
} from 'reka-ui';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<
  ContextMenuContentProps & { class?: HTMLAttributes['class'] }
>();
const emits = defineEmits<ContextMenuContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      data-slot="context-menu-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'z-popup bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-(--reka-context-menu-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
          props.class,
        )
      "
    >
      <slot></slot>
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
