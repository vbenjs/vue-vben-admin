<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@vben-core/shadcn-ui/components/ui/tooltip';

import { TooltipContentProps } from 'radix-vue';

interface Props {
  contentClass?: HTMLAttributes['class'];
  delayDuration?: number;
  side: TooltipContentProps['side'];
}

withDefaults(defineProps<Props>(), {
  delayDuration: 0,
  side: 'right',
});
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <Tooltip>
      <TooltipTrigger as-child tabindex="-1">
        <slot name="trigger"></slot>
      </TooltipTrigger>
      <TooltipContent
        :class="contentClass"
        :side="side"
        class="side-content text-popover-foreground bg-popover"
      >
        <slot></slot>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
