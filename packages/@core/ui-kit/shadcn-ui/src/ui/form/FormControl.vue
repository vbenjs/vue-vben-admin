<script lang="ts" setup>
import { Slot } from 'reka-ui';

import { useFormField } from './useFormField';

const props = defineProps<{
  hasGroupLabel?: boolean;
  isRadioGroup?: boolean;
}>();

const { error, formItemId, formItemLabelId, formDescriptionId, formMessageId } =
  useFormField();
</script>

<template>
  <Slot
    :id="formItemId"
    :role="props.isRadioGroup ? 'radiogroup' : undefined"
    :aria-labelledby="
      props.isRadioGroup && props.hasGroupLabel ? formItemLabelId : undefined
    "
    data-slot="form-control"
    :aria-describedby="
      !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
    "
    :aria-invalid="!!error"
  >
    <slot></slot>
  </Slot>
</template>
