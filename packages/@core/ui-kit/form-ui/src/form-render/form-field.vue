<script setup lang="ts">
import type { ZodType } from 'zod';

import type {
  FormActions,
  FormFieldProps,
  FormRuleContext,
  FormRuntimeField,
  MaybeComponentProps,
} from '../types';

import {
  computed,
  markRaw,
  nextTick,
  onUnmounted,
  ref,
  toRaw,
  useTemplateRef,
  watch,
} from 'vue';

import { ChevronsDown, CircleAlert } from '@vben-core/icons';
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  VbenCollapsible,
  VbenRenderContent,
  VbenTooltip,
} from '@vben-core/shadcn-ui';
import { cn, isFunction, isObject, isString } from '@vben-core/shared/utils';

import { getFormRule } from '../rule-registry';
import { injectComponentRefMap } from '../use-form-context';
import { injectRenderFormProps, useFormContext } from './context';
import useDependencies from './dependencies';
import FormLabel from './form-label.vue';
import { getBaseRules, isEventObjectLike } from './helper';

interface Props extends FormFieldProps {}

interface RuntimeFieldSlotProps {
  field: FormRuntimeField<any>;
}

const {
  changeEventFallback,
  colon,
  commonComponentProps,
  component,
  componentProps,
  dependencies,
  description,
  disabled,
  emptyStateValue,
  fieldName,
  formFieldProps,
  hide,
  label,
  labelClass,
  labelWidth,
  modelPropName,
  renderComponentContent,
  rules,
  help,
  collapsible,
  defaultCollapsed = false,
} = defineProps<
  Props & {
    commonComponentProps: MaybeComponentProps;
  }
>();

const { componentBindEventMap, componentMap, isVertical } = useFormContext();
const formRenderProps = injectRenderFormProps();
const fieldComponentRef = useTemplateRef<HTMLInputElement>('fieldComponentRef');
const formApi = formRenderProps.form;
if (!formApi) {
  throw new Error('Form api is required in <FormField />');
}
const error = formApi.useFieldError(fieldName);
const fieldValue = formApi.useFieldValue(fieldName);
const compact = computed(() => formRenderProps.compact);
const isInValid = computed(() => Boolean(error.value));
const shouldApplyInvalidStyle = computed(() => {
  return isInValid.value && component !== 'VbenFormFieldArray';
});
const collapseOpen = ref(!defaultCollapsed);

function getFormApi(): FormActions {
  if (!formApi) {
    throw new Error('Form api is required in <FormField />');
  }

  return formApi;
}

const FieldComponent = computed(() => {
  const finalComponent = isString(component)
    ? componentMap.value[component]
    : component;
  if (!finalComponent) {
    // 组件未注册
    console.warn(`Component ${component} is not registered`);
  }
  return finalComponent ? markRaw(toRaw(finalComponent)) : finalComponent;
});

const {
  dynamicComponentProps,
  dynamicHelp,
  dynamicHelpResolved,
  dynamicRenderComponentContent,
  dynamicRenderComponentContentResolved,
  dynamicRules,
  dynamicRulesResolved,
  isDisabled,
  isIf,
  isRequired,
  isShow,
} = useDependencies(
  () => dependencies,
  () => ({ fieldName }),
);

const labelStyle = computed(() => {
  return labelClass?.includes('w-') || isVertical.value
    ? {}
    : {
        width: `${labelWidth}px`,
      };
});

const currentRules = computed(() => {
  const currentRule = dynamicRulesResolved.value ? dynamicRules.value : rules;
  return currentRule && !isString(currentRule)
    ? toRaw(currentRule)
    : currentRule;
});

const visible = computed(() => {
  return !hide && isIf.value && isShow.value;
});

const shouldRequired = computed(() => {
  if (!visible.value) {
    return false;
  }

  if (!currentRules.value) {
    return isRequired.value;
  }

  if (isRequired.value) {
    return true;
  }

  if (isString(currentRules.value)) {
    return ['required', 'selectRequired'].includes(currentRules.value);
  }

  return !currentRules.value.isOptional();
});

const fieldRules = computed(() => {
  if (!visible.value) {
    return null;
  }

  let rules = currentRules.value;
  if (!rules) {
    return isRequired.value ? 'required' : null;
  }

  if (isString(rules)) {
    return rules;
  }

  const isOptional = !shouldRequired.value;
  if (!isOptional) {
    rules = getBaseRules(rules) ?? rules;
  }
  return rules as ZodType;
});

async function validateFieldValue({ value }: { value: any }) {
  const activeRules = fieldRules.value;
  if (!activeRules) {
    return;
  }

  if (isString(activeRules)) {
    const validator = getFormRule(activeRules);
    if (!validator) {
      console.warn(`Form rule ${activeRules} is not registered`);
      return;
    }
    const ruleContext: FormRuleContext = {
      field: {
        label: isString(label) ? label : undefined,
        name: fieldName,
      },
      label: isString(label) ? label : undefined,
      name: fieldName,
    };
    const result = await validator(value, [], ruleContext);
    return result === true ? undefined : result;
  }

  const result = await activeRules.safeParseAsync(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

const fieldValidators = computed(() => {
  const validators: Record<string, typeof validateFieldValue> = {
    onSubmitAsync: validateFieldValue,
  };
  const validateOn = new Set(formFieldProps?.validateOn ?? ['blur', 'change']);
  if (validateOn.has('blur')) {
    validators.onBlurAsync = validateFieldValue;
  }
  if (validateOn.has('change')) {
    validators.onChangeAsync = validateFieldValue;
  }
  return validators;
});

const computedProps = computed(() => {
  const finalComponentProps = isFunction(componentProps)
    ? componentProps({ fieldName })
    : componentProps;

  return {
    ...commonComponentProps,
    ...finalComponentProps,
    ...dynamicComponentProps.value,
  };
});

// 自定义帮助信息
const computedHelp = computed(() => {
  const helpContent = dynamicHelpResolved.value ? dynamicHelp.value : help;
  if (!helpContent) {
    return undefined;
  }
  return () =>
    isFunction(helpContent) ? helpContent({ fieldName }) : helpContent;
});

watch(
  () => computedProps.value?.autofocus,
  (value) => {
    if (value === true) {
      nextTick(() => {
        autofocus();
      });
    }
  },
  { immediate: true },
);

const shouldDisabled = computed(() => {
  return isDisabled.value || disabled || computedProps.value?.disabled;
});

const customContentRender = computed(() => {
  if (dynamicRenderComponentContentResolved.value) {
    return dynamicRenderComponentContent.value ?? {};
  }
  if (!isFunction(renderComponentContent)) {
    return {};
  }
  return renderComponentContent({ fieldName });
});

const renderContentKey = computed(() => {
  return Object.keys(customContentRender.value);
});

const fieldProps = computed(() => {
  return {
    asyncDebounceMs: formFieldProps?.asyncDebounceMs,
    validators: fieldValidators.value,
  };
});

function createFieldSlotProps(slotProps: RuntimeFieldSlotProps) {
  const { field } = slotProps;
  function handleChange(value: any) {
    getFormApi().setFieldError(fieldName);
    field.handleChange(value);
  }
  return {
    ...slotProps,
    componentField: {
      name: fieldName,
      modelValue: fieldValue.value,
      onBlur: field.handleBlur,
      onChange: handleChange,
      onInput: handleChange,
      'onUpdate:modelValue': handleChange,
    },
  };
}

function fieldBindEvent(componentField: Record<string, any>) {
  const modelValue = componentField.modelValue;
  const handler = componentField['onUpdate:modelValue'];

  const bindEventField =
    modelPropName ||
    (isString(component) ? componentBindEventMap.value?.[component] : null);

  let value = modelValue;
  // antd design 的一些组件会传递一个 event 对象
  if (modelValue && isObject(modelValue) && bindEventField) {
    value = isEventObjectLike(modelValue)
      ? modelValue?.target?.[bindEventField]
      : (modelValue?.[bindEventField] ?? modelValue);
  }

  if (bindEventField) {
    const eventField = bindEventField;

    function handleChangeEvent(event: Record<string, any>) {
      const value = isEventObjectLike(event)
        ? (event?.target?.[eventField] ?? event)
        : event;
      return handler?.(value);
    }

    return {
      [`onUpdate:${eventField}`]: handler,
      [eventField]: value === undefined ? emptyStateValue : value,
      onChange: changeEventFallback ? handleChangeEvent : undefined,
      onInput: undefined,
    };
  }
  return {
    onChange: changeEventFallback ? componentField.onChange : undefined,
    onInput: undefined,
  };
}

function createComponentProps(slotProps: RuntimeFieldSlotProps) {
  const normalizedSlotProps = createFieldSlotProps(slotProps);
  const bindEvents = fieldBindEvent(normalizedSlotProps.componentField);

  const binds = {
    ...normalizedSlotProps.componentField,
    ...computedProps.value,
    ...bindEvents,
    ...(Reflect.has(computedProps.value, 'onChange')
      ? { onChange: computedProps.value.onChange }
      : {}),
    ...(Reflect.has(computedProps.value, 'onInput')
      ? { onInput: computedProps.value.onInput }
      : {}),
  };

  return binds;
}

function autofocus() {
  if (
    fieldComponentRef.value &&
    isFunction(fieldComponentRef.value.focus) &&
    // 检查当前是否有元素被聚焦
    document.activeElement !== fieldComponentRef.value
  ) {
    fieldComponentRef.value?.focus?.();
  }
}

const shouldCollapsible = computed(() => {
  return collapsible; /* && isVertical.value; */
});

function toggleCollapsed() {
  collapseOpen.value = !collapseOpen.value;
}

const componentRefMap = injectComponentRefMap();
watch(fieldComponentRef, (componentRef) => {
  componentRefMap?.set(fieldName, componentRef);
});
onUnmounted(() => {
  if (componentRefMap?.has(fieldName)) {
    componentRefMap.delete(fieldName);
  }
});
</script>

<template>
  <component
    v-if="!hide && isIf"
    :is="formApi.fieldComponent"
    v-bind="fieldProps"
    v-slot="slotProps"
    :name="fieldName"
  >
    <FormField
      :dirty="slotProps.field.state.meta.isDirty"
      :error="error"
      :name="fieldName"
      :touched="slotProps.field.state.meta.isTouched"
      :valid="slotProps.field.state.meta.isValid"
    >
      <FormItem
        v-show="isShow"
        :class="{
          'form-valid-error': shouldApplyInvalidStyle,
          'form-is-required': shouldRequired,
          'flex-col': isVertical,
          'flex-row items-center': !isVertical,
          'pb-4': !compact,
          'pb-2': compact,
        }"
        class="relative flex"
        v-bind="$attrs"
      >
        <FormLabel
          v-if="!hideLabel"
          :class="
            cn(
              'flex leading-6',
              {
                'mr-2 shrink-0 justify-end': !isVertical,
                'mb-1 flex-row': isVertical,
                'self-start': shouldCollapsible && !isVertical,
              },
              labelClass,
            )
          "
          :help="computedHelp"
          :colon="colon"
          :label="label"
          :required="shouldRequired && !hideRequiredMark"
          :style="labelStyle"
        >
          <template v-if="label">
            <VbenRenderContent :content="label" />
          </template>
          <template #extra>
            <Button
              class="ml-0.5"
              variant="icon"
              size="icon"
              @click.prevent="toggleCollapsed"
              v-if="shouldCollapsible"
            >
              <ChevronsDown
                :size="16"
                class="transition-transform"
                :class="{
                  'rotate-180': !collapseOpen,
                }"
              />
            </Button>
          </template>
        </FormLabel>
        <div class="flex-auto overflow-hidden p-px">
          <VbenCollapsible :show-trigger="false" v-model:open="collapseOpen">
            <template #collapsibleContent>
              <div
                :class="cn('relative flex w-full items-center', wrapperClass)"
              >
                <FormControl :class="cn(controlClass)">
                  <slot
                    v-bind="{
                      ...createFieldSlotProps(slotProps),
                      ...createComponentProps(slotProps),
                      disabled: shouldDisabled,
                      isInValid,
                    }"
                  >
                    <component
                      :is="FieldComponent"
                      ref="fieldComponentRef"
                      :class="{
                        'border-destructive hover:border-destructive/80 focus:border-destructive focus:shadow-[0_0_0_2px_rgba(255,38,5,0.06)]':
                          shouldApplyInvalidStyle,
                      }"
                      v-bind="createComponentProps(slotProps)"
                      :disabled="shouldDisabled"
                    >
                      <template
                        v-for="name in renderContentKey"
                        :key="name"
                        #[name]="renderSlotProps"
                      >
                        <VbenRenderContent
                          :content="customContentRender[name]"
                          v-bind="{
                            ...renderSlotProps,
                            formContext: createFieldSlotProps(slotProps),
                          }"
                        />
                      </template>
                      <!-- <slot></slot> -->
                    </component>
                    <VbenTooltip
                      v-if="compact && isInValid"
                      :delay-duration="300"
                      side="left"
                    >
                      <template #trigger>
                        <slot name="trigger">
                          <CircleAlert
                            :class="
                              cn(
                                'inline-flex size-5 cursor-pointer text-foreground/80 hover:text-foreground',
                              )
                            "
                          />
                        </slot>
                      </template>
                      <FormMessage />
                    </VbenTooltip>
                  </slot>
                </FormControl>
                <!-- 自定义后缀 -->
                <div v-if="suffix" class="ml-1">
                  <VbenRenderContent :content="suffix" />
                </div>
              </div>
            </template>
          </VbenCollapsible>

          <FormDescription v-if="description" class="text-xs">
            <VbenRenderContent :content="description" />
          </FormDescription>

          <Transition name="slide-up" v-if="!compact">
            <FormMessage class="absolute" />
          </Transition>
        </div>
      </FormItem>
    </FormField>
  </component>
</template>
