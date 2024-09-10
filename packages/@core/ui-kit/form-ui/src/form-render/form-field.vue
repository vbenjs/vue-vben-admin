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
import { cn, isFunction, isObject, isString } from '@vben-core/shared/utils';

import { toTypedSchema } from '@vee-validate/zod';
import { useFormValues } from 'vee-validate';

import { injectRenderFormProps, useFormContext } from './context';
import useDependencies from './dependencies';
import FormLabel from './form-label.vue';
import { isEventObjectLike } from './helper';

interface Props extends FormSchema {}

const {
  component,
  componentProps,
  dependencies,
  description,
  disabled,
  fieldName,
  formFieldProps,
  label,
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

const currentRules = computed(() => {
  return dynamicRules.value || rules;
});

const shouldRequired = computed(() => {
  if (!currentRules.value) {
    return isRequired.value;
  }

  if (isRequired.value) {
    return true;
  }

  if (isString(currentRules.value)) {
    return currentRules.value === 'required';
  }

  let isOptional = currentRules?.value?.isOptional?.();

  // 如果有设置默认值，则不是必填，需要特殊处理
  const typeName = currentRules?.value?._def?.typeName;
  if (typeName === 'ZodDefault') {
    const innerType = currentRules?.value?._def.innerType;
    if (innerType) {
      isOptional = innerType.isOptional?.();
    }
  }

  return !isOptional;
});

const fieldRules = computed(() => {
  let rules = currentRules.value;
  if (!rules) {
    return isRequired.value ? 'required' : null;
  }

  if (isString(rules)) {
    return rules;
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

const shouldDisabled = computed(() => {
  return isDisabled.value || disabled || computedProps.value?.disabled;
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

const fieldProps = computed(() => {
  const rules = fieldRules.value;
  return {
    keepValue: true,
    label,
    ...(rules ? { rules } : {}),
    ...formFieldProps,
  };
});

function fieldBindEvent(slotProps: Record<string, any>) {
  const modelValue = slotProps.componentField.modelValue;
  const handler = slotProps.componentField['onUpdate:modelValue'];

  const bindEventField = isString(component)
    ? componentBindEventMap.value?.[component]
    : null;

  let value = modelValue;
  // antd design 的一些组件会传递一个 event 对象
  if (modelValue && isObject(modelValue) && bindEventField) {
    value = isEventObjectLike(modelValue)
      ? modelValue?.target?.[bindEventField]
      : modelValue;
  }
  if (bindEventField) {
    return {
      [`onUpdate:${bindEventField}`]: handler,
      [bindEventField]: value,
      onChange: (e: Record<string, any>) => {
        const shouldUnwrap = isEventObjectLike(e);
        const onChange = slotProps?.componentField?.onChange;
        if (!shouldUnwrap) {
          return onChange?.(e);
        }

        return onChange?.(e?.target?.[bindEventField] ?? e);
      },
      onInput: () => {},
    };
  }
  return {};
}

function createComponentProps(slotProps: Record<string, any>) {
  const bindEvents = fieldBindEvent(slotProps);

  const binds = {
    ...slotProps.componentField,
    ...computedProps.value,
    ...bindEvents,
  };

  return binds;
}
</script>

<template>
  <FormField
    v-if="isIf"
    v-bind="fieldProps"
    v-slot="slotProps"
    :name="fieldName"
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
          <slot
            v-bind="{
              ...slotProps,
              ...createComponentProps(slotProps),
              disabled: shouldDisabled,
            }"
          >
            <component
              :is="fieldComponent"
              v-bind="createComponentProps(slotProps)"
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
