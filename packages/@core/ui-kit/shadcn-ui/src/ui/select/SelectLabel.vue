<script setup lang="ts">
import type { SelectLabelProps } from 'reka-ui';

import { cn } from '@vben-core/shared/utils';

import { SelectLabel } from 'reka-ui';

const props = defineProps<SelectLabelProps & { class?: any }>();
</script>

<template>
  <SelectLabel
    data-slot="select-label"
    :class="cn('text-muted-foreground px-2 py-1.5 text-xs', props.class)"
  >
    <slot></slot>
  </SelectLabel>
</template>
