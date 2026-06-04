<script setup lang="ts">
import type { DialogOverlayProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { DialogOverlay } from 'reka-ui';

const props = defineProps<
  DialogOverlayProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <DialogOverlay
    data-slot="dialog-overlay"
    v-bind="delegatedProps"
    :class="
      cn(
        'z-popup bg-overlay inset-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed',
        props.class,
      )
    "
  >
    <slot></slot>
  </DialogOverlay>
</template>
