<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { AvatarFallback } from 'reka-ui';

const props = defineProps<
  AvatarFallbackProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        props.class,
      )
    "
  >
    <slot></slot>
  </AvatarFallback>
</template>
