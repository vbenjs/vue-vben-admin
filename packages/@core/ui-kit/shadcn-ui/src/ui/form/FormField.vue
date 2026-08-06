<script setup lang="ts">
import { provide, toRefs } from 'vue';

import { FORM_FIELD_INJECTION_KEY } from './injectionKeys';

const props = withDefaults(
  defineProps<{
    dirty?: boolean;
    error?: string;
    name: string;
    touched?: boolean;
    valid?: boolean;
  }>(),
  {
    dirty: false,
    error: undefined,
    touched: false,
    valid: true,
  },
);

const { dirty, error, name, touched, valid } = toRefs(props);

provide(FORM_FIELD_INJECTION_KEY, {
  dirty,
  error,
  name,
  touched,
  valid,
});
</script>

<template>
  <slot></slot>
</template>
