<script setup lang="ts">
import type { AlertDialogCancelProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { AlertDialogCancel } from 'reka-ui';

const props = defineProps<
  AlertDialogCancelProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <AlertDialogCancel
    v-bind="delegatedProps"
    :class="cn('mt-2 sm:mt-0', props.class)"
  >
    <slot></slot>
  </AlertDialogCancel>
</template>
