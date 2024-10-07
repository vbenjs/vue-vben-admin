<script setup lang="ts">
import type { ExtendedFormApi, VbenFormProps } from './types';

// import { toRaw, watch } from 'vue';

import { useForwardPriorityValues } from '@vben-core/composables';
// import { isFunction } from '@vben-core/shared/utils';

import FormActions from './components/form-actions.vue';
import {
  COMPONENT_BIND_EVENT_MAP,
  COMPONENT_MAP,
  DEFAULT_FORM_COMMON_CONFIG,
} from './config';
import { Form } from './form-render';
import { provideFormProps, useFormInitial } from './use-form-context';
// 通过 extends 会导致热更新卡死，所以重复写了一遍
interface Props extends VbenFormProps {
  formApi: ExtendedFormApi;
}

const props = defineProps<Props>();

const state = props.formApi?.useStore?.();

const forward = useForwardPriorityValues(props, state);

const { delegatedSlots, form } = useFormInitial(forward);

provideFormProps([forward, form]);

props.formApi?.mount?.(form);

const handleUpdateCollapsed = (value: boolean) => {
  props.formApi?.setState({ collapsed: !!value });
};
</script>

<template>
  <Form
    v-bind="forward"
    :collapsed="state.collapsed"
    :component-bind-event-map="COMPONENT_BIND_EVENT_MAP"
    :component-map="COMPONENT_MAP"
    :form="form"
    :global-common-config="DEFAULT_FORM_COMMON_CONFIG"
  >
    <template
      v-for="slotName in delegatedSlots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps"></slot>
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <FormActions
          v-if="forward.showDefaultActions"
          :model-value="state.collapsed"
          @update:model-value="handleUpdateCollapsed"
        />
      </slot>
    </template>
  </Form>
</template>
