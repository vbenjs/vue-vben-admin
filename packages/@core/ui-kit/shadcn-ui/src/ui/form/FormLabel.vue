<script lang="ts" setup>
import type { LabelProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Label } from '../label';
import { useFormField } from './useFormField';

const props = defineProps<
  LabelProps & { class?: HTMLAttributes['class']; isGroupLabel?: boolean }
>();

const { error, formItemId, formItemLabelId } = useFormField();
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn(props.class)"
    :as="props.isGroupLabel ? 'div' : undefined"
    :id="props.isGroupLabel ? formItemLabelId : undefined"
    :for="props.isGroupLabel ? undefined : formItemId"
  >
    <slot></slot>
  </Label>
</template>
