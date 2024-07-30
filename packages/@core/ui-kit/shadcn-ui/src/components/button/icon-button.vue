<script setup lang="ts">
import { computed, type HTMLAttributes, useSlots } from 'vue';

import { VbenTooltip } from '@vben-core/shadcn-ui/components/tooltip';
import { ButtonVariants } from '@vben-core/shadcn-ui/components/ui/button';
import { cn } from '@vben-core/shared';

import { type PrimitiveProps } from 'radix-vue';

import VbenButton from './button.vue';

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top';
  variant?: ButtonVariants['variant'];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  onClick: () => {},
  tooltipSide: 'bottom',
  variant: 'icon',
});

const slots = useSlots();

const showTooltip = computed(() => !!slots.tooltip || !!props.tooltip);
</script>

<template>
  <VbenButton
    v-if="!showTooltip"
    :class="cn('rounded-full', props.class)"
    :disabled="disabled"
    :variant="variant"
    size="icon"
    @click="onClick"
  >
    <slot></slot>
  </VbenButton>

  <VbenTooltip v-else :side="tooltipSide">
    <template #trigger>
      <VbenButton
        :class="cn('rounded-full', props.class)"
        :disabled="disabled"
        :variant="variant"
        size="icon"
        @click="onClick"
      >
        <slot></slot>
      </VbenButton>
    </template>
    <slot v-if="slots.tooltip" name="tooltip"> </slot>
    <template v-else>
      {{ tooltip }}
    </template>
  </VbenTooltip>
</template>
