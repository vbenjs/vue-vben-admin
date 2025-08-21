<script lang="ts" setup>
import { toValue } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { ErrorMessage } from 'vee-validate';

import { useFormField } from './useFormField';

interface Props {
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const { formMessageId, name } = useFormField();
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    :name="toValue(name)"
    :as="props.compact ? 'div' : 'p'"
    :class="
      cn(
        'text-[0.8rem]',
        props.compact ? 'vben-form-message-compact' : 'text-destructive',
      )
    "
  />
</template>

<style>
.vben-form-message-compact {
  position: absolute;
  top: 100%;
  left: 1rem;
  z-index: 1;
  width: calc(100% - 1rem);
  height: auto;
  min-height: 1.5rem;
  padding: 2px 8px;
  color: white;
  background: hsl(var(--destructive));
  border-radius: var(--radius);
  opacity: 1;
}
</style>
