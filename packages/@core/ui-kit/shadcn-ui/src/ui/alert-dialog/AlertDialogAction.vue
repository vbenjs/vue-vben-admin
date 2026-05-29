<script setup lang="ts">
import type { AlertDialogActionProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { reactiveOmit } from '@vueuse/core';
import { AlertDialogAction } from 'reka-ui';

import { buttonVariants } from '../button';

const props = defineProps<
  AlertDialogActionProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <AlertDialogAction
    v-bind="delegatedProps"
    :class="cn(buttonVariants(), props.class)"
  >
    <slot></slot>
  </AlertDialogAction>
</template>
