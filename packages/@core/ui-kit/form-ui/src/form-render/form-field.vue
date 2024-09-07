<script setup lang="ts">
import type { ZodType } from 'zod';

import type { FormSchema } from '../types';

import { computed } from 'vue';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  VbenRenderContent,
} from '@vben-core/shadcn-ui';
import { cn, isFunction, isString } from '@vben-core/shared/utils';

import { toTypedSchema } from '@vee-validate/zod';
import { useFormValues } from 'vee-validate';

import { injectRenderFormProps, useFormContext } from './context';
import useDependencies from './dependencies';
import FormLabel from './form-label.vue';

interface Props extends FormSchema {}

const {
  component,
  componentProps,
  dependencies,
  description,
  disabled,
  fieldName,
  formFieldProps,
  labelClass,
  labelWidth,
  renderComponentContent,
  rules,
} = defineProps<Props>();

const { componentBindEventMap, componentMap, isVertical } = useFormContext();
const formRenderProps = injectRenderFormProps();
const values = useFormValues();
const formApi = formRenderProps.form;

const fieldComponent = computed(() => {
  const finalComponent = isString(component)
    ? componentMap.value[component]
    : component;
  if (!finalComponent) {
    // 组件未注册
    console.warn(`Component ${component} is not registered`);
  }
  return finalComponent;
});

function fieldBindEvent(modelValue: any, handler: any) {
  const bindEventField = isString(component)
    ? componentBindEventMap.value?.[component]
    : null;

  if (bindEventField) {
    return {
      [`onUpdate:${bindEventField}`]: handler,
      [bindEventField]: modelValue,
    };
  }
  return {};
}

const {
  dynamicComponentProps,
  dynamicRules,
  isDisabled,
  isIf,
  isRequired,
  isShow,
} = useDependencies(() => dependencies);

const labelStyle = computed(() => {
  return labelClass?.includes('w-') || isVertical.value
    ? {}
    : {
        width: `${labelWidth}px`,
      };
});

const shouldDisabled = computed(() => {
  return isDisabled.value || disabled;
});

const currentRules = computed(() => {
  return dynamicRules.value || rules;
});

const shouldRequired = computed(() => {
  // !schema._def.shape()[field]?.isOptional();
  return isRequired.value || !currentRules?.value?.isOptional?.();
});

const fieldRules = computed(() => {
  let rules = currentRules.value;
  if (!rules) {
    return;
  }

  const isOptional = !shouldRequired.value;

  if (!isOptional) {
    const unwrappedRules = (rules as any)?.unwrap?.();
    if (unwrappedRules) {
      rules = unwrappedRules;
    }
  }
  return toTypedSchema(rules as ZodType);
});

const computedProps = computed(() => {
  const finalComponentProps = isFunction(componentProps)
    ? componentProps(values.value, formApi!)
    : componentProps;

  return {
    ...finalComponentProps,
    ...dynamicComponentProps.value,
  };
});

const customContentRender = computed(() => {
  if (!isFunction(renderComponentContent)) {
    return {};
  }
  return renderComponentContent(values.value, formApi!);
});

const renderContentKey = computed(() => {
  return Object.keys(customContentRender.value);
});
</script>

<template>
  <FormField
    v-if="isIf"
    v-bind="formFieldProps"
    v-slot="slotProps"
    :keep-values="true"
    :name="fieldName"
    :rules="fieldRules"
    keep-value
  >
    <FormItem
      v-show="isShow"
      :class="{
        'flex-col': isVertical,
        'flex-row items-center': !isVertical,
      }"
      class="flex pb-6"
      v-bind="$attrs"
    >
      <FormLabel
        v-if="!hideLabel"
        :class="
          cn(
            'flex leading-6',
            {
              'mr-2 flex-shrink-0': !isVertical,
              'flex-row': isVertical,
            },
            !isVertical && labelClass,
          )
        "
        :help="help"
        :required="shouldRequired && !hideRequiredMark"
        :style="labelStyle"
      >
        {{ label }}
      </FormLabel>
      <div :class="cn('relative flex w-full items-center', wrapperClass)">
        <FormControl :class="cn(controlClass)">
          <slot v-bind="slotProps">
            <component
              :is="fieldComponent"
              v-bind="{
                ...slotProps.componentField,
                ...computedProps,
                ...fieldBindEvent(
                  slotProps.componentField.modelValue,
                  slotProps.componentField['onUpdate:modelValue'],
                ),
              }"
              :disabled="shouldDisabled"
            >
              <template v-for="name in renderContentKey" :key="name" #[name]>
                <VbenRenderContent
                  :content="customContentRender[name]"
                  v-bind="slotProps"
                />
              </template>
              <!-- <slot></slot> -->
            </component>
          </slot>
        </FormControl>
        <!-- 自定义后缀 -->
        <div v-if="suffix" class="ml-1">
          <VbenRenderContent :content="suffix" />
        </div>

        <FormDescription v-if="description">
          <VbenRenderContent :content="description" />
        </FormDescription>

        <Transition name="slide-up">
          <FormMessage class="absolute -bottom-[22px]" />
        </Transition>
      </div>
    </FormItem>
  </FormField>
</template>
