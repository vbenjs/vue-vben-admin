<script setup lang="ts">
import type {
  ContextMenuCheckboxItemEmits,
  ContextMenuCheckboxItemProps,
} from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Check } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import {
  ContextMenuCheckboxItem,
  ContextMenuItemIndicator,
  useForwardPropsEmits,
} from 'reka-ui';

const props = defineProps<
  ContextMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }
>();
const emits = defineEmits<ContextMenuCheckboxItemEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ContextMenuCheckboxItem
    data-slot="context-menu-checkbox-item"
    v-bind="forwarded"
    :class="
      cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
  >
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    >
      <ContextMenuItemIndicator>
        <slot name="indicator-icon">
          <Check class="size-4" />
        </slot>
      </ContextMenuItemIndicator>
    </span>
    <slot></slot>
  </ContextMenuCheckboxItem>
</template>
