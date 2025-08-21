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
  height: auto;
  min-height: 1.5rem;
  opacity: 1;
  position: absolute;
  top: 100%;
  z-index: 1;
  background: hsl(var(--destructive));
  width: calc(100% - 1rem);
  color: white;
  border-radius: var(--radius);
  left: 1rem;
  padding: 2px 8px;
}
</style>
