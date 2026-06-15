<script setup lang="ts">
import type { ContextMenuSeparatorProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { ContextMenuSeparator } from 'reka-ui';

const props = defineProps<
  ContextMenuSeparatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <ContextMenuSeparator
    data-slot="context-menu-separator"
    v-bind="delegatedProps"
    :class="cn('bg-border -mx-1 my-1 h-px', props.class)"
  />
</template>
