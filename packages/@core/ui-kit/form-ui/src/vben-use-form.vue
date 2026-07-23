<script setup lang="ts">
import type { ExtendedFormApi, VbenFormProps, VbenFormSlots } from './types';

import { nextTick, onMounted, readonly, watch } from 'vue';

import { useForwardPriorityValues } from '@vben-core/composables';
import { get, isEqual } from '@vben-core/shared/utils';

import { useDebounceFn } from '@vueuse/core';

import FormActions from './components/form-actions.vue';
import {
  COMPONENT_BIND_EVENT_MAP,
  COMPONENT_MAP,
  DEFAULT_FORM_COMMON_CONFIG,
} from './config';
import { Form } from './form-render';
import {
  provideComponentRefMap,
  provideFormProps,
  useFormInitial,
} from './use-form-context';

// 通过 extends 会导致热更新卡死，所以重复写了一遍
interface Props extends VbenFormProps {
  formApi?: ExtendedFormApi<any, any, any, any>;
}

const props = defineProps<Props>();
defineSlots<
  Record<string, ((props: Record<string, any>) => any) | undefined> &
    VbenFormSlots<any, any, any>
>();

const formApi = props.formApi;
if (!formApi) {
  throw new Error('Form api is required in <VbenUseForm />');
}

const state = formApi.useStore();

const forward = useForwardPriorityValues(props, state);

const componentRefMap = new Map<string, unknown>();

const { delegatedSlots, form } = useFormInitial(forward);
const values = form.useValues();

provideFormProps([forward, form]);
provideComponentRefMap(componentRefMap);

formApi.mount(form, componentRefMap);

function handleUpdateCollapsed(value: boolean) {
  props.formApi?.setState({ collapsed: value });
  // 触发收起展开状态变化回调
  forward.value.handleCollapsedChange?.(value);
}

function handleKeyDownEnter(event: KeyboardEvent) {
  if (!state?.value.submitOnEnter || !forward.value.formApi?.isMounted) {
    return;
  }
  // 如果是 textarea 不阻止默认行为，否则会导致无法换行。
  // 跳过 textarea 的回车提交处理
  if (event.target instanceof HTMLTextAreaElement) {
    return;
  }
  event.preventDefault();

  forward.value.formApi?.validateAndSubmit();
}

const handleValuesChangeDebounced = useDebounceFn(async () => {
  state?.value.submitOnChange && forward.value.formApi?.validateAndSubmit();
}, state?.value?.changeDebouncedTime ?? 300);

let valuesChangeReady = false;

onMounted(async () => {
  // 只在挂载后开始监听，form.values会有一个初始化的过程
  await nextTick();
  valuesChangeReady = true;
});

watch(values, (currentValues, previousValues) => {
  if (!valuesChangeReady) {
    return;
  }
  const fields = state?.value.schema?.map((item) => item.fieldName) ?? [];
  if (forward.value.handleValuesChange && fields.length > 0) {
    const changedFields = fields.filter((field) => {
      return !isEqual(
        get(currentValues, field),
        get(previousValues ?? {}, field),
      );
    });
    if (changedFields.length > 0) {
      forward.value.handleValuesChange(
        readonly(currentValues),
        changedFields,
        () => formApi.formatValues(currentValues),
      );
    }
  }
  handleValuesChangeDebounced();
});
</script>

<template>
  <Form
    @keydown.enter="handleKeyDownEnter"
    v-bind="forward"
    :collapsed="state?.collapsed"
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
      <slot
        :name="slotName"
        v-bind="slotProps"
        :form-api="formApi"
        :values="form.values"
      ></slot>
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" :form-api="formApi" :values="form.values">
        <FormActions
          v-if="forward.showDefaultActions"
          :model-value="state?.collapsed"
          @update:model-value="handleUpdateCollapsed"
        >
          <template #reset-before="resetSlotProps">
            <slot
              name="reset-before"
              v-bind="resetSlotProps"
              :form-api="formApi"
              :values="form.values"
            ></slot>
          </template>
          <template #submit-before="submitSlotProps">
            <slot
              name="submit-before"
              v-bind="submitSlotProps"
              :form-api="formApi"
              :values="form.values"
            ></slot>
          </template>
          <template #expand-before="expandBeforeSlotProps">
            <slot
              name="expand-before"
              v-bind="expandBeforeSlotProps"
              :form-api="formApi"
              :values="form.values"
            ></slot>
          </template>
          <template #expand-after="expandAfterSlotProps">
            <slot
              name="expand-after"
              v-bind="expandAfterSlotProps"
              :form-api="formApi"
              :values="form.values"
            ></slot>
          </template>
        </FormActions>
      </slot>
    </template>
  </Form>
</template>
