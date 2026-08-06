<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { useFormField } from './useFormField';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { error, formMessageId } = useFormField();
</script>

<template>
  <p
    v-if="error"
    :id="formMessageId"
    data-slot="form-message"
    :class="cn('text-destructive text-sm', props.class)"
  >
    {{ error }}
  </p>
</template>
