import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue';

import type { FormValidationTrigger } from './types';

import { computed, inject, onUnmounted, provide, toRaw, watch } from 'vue';

import { cloneDeep, isEqual } from '@vben-core/shared/utils';

export interface FormCustomFieldContext {
  /** 已注册的取值函数，同一表单项只接受一个 */
  customValue: ShallowRef<(() => any) | undefined>;
  disabled: ComputedRef<boolean>;
  error: Readonly<Ref<string | undefined>>;
  fieldName: string;
  resetValidation: () => void;
  setValue: (value: any) => void;
  validateWithTrigger: (trigger: FormValidationTrigger) => void;
  value: Readonly<Ref<any>>;
}

export interface UseCustomFieldValueOptions {
  /** 取值为对象/数组且原地修改时开启 */
  deep?: boolean;
  /** 挂载时把当前值写入表单（不触发校验） */
  immediate?: boolean;
}

export interface UseCustomFieldValueReturn<T> {
  /** 表单项的禁用态（含表单级、schema 级、依赖计算） */
  disabled: ComputedRef<boolean>;
  /** 表单项当前的校验错误 */
  error: Readonly<Ref<string | undefined>>;
  /** 所在表单项的字段名，不在表单项内时为 undefined */
  fieldName: string | undefined;
  /** 清除该表单项的校验状态 */
  resetValidation: () => void;
  /** 表单中该字段的值，可用于响应 setValues / resetForm */
  value: ComputedRef<T | undefined>;
}

const CUSTOM_FIELD_INJECTION_KEY: InjectionKey<FormCustomFieldContext> = Symbol(
  'VbenFormCustomField',
);

export function provideFormCustomField(context: FormCustomFieldContext) {
  provide(CUSTOM_FIELD_INJECTION_KEY, context);
}

/**
 * 让 VbenForm 表单项内的自定义组件把自己的值交给表单。
 *
 * 组件既没有绑定 `componentProps`（插槽用法），也没有实现 `modelValue` 时，
 * 表单拿不到它的值，schema 上的 rules 也就无从校验。调用该函数后，取值函数的
 * 结果会写回表单字段，并按表单项的 `validateOn` 触发校验。
 *
 * 值仍归表单所有：组件应继续用 `modelValue` 接收表单下发的值（插槽用法就是
 * `v-bind="slotProps.componentProps"`），`setValues`、重置才能顺着 props 流回组件。
 * 只有完全自持内部状态的组件，才需要用返回的 `value` 自行同步。
 */
export function useCustomFieldValue<T = any>(
  customValue: () => T,
  options: UseCustomFieldValueOptions = {},
): UseCustomFieldValueReturn<T> {
  const field = inject(CUSTOM_FIELD_INJECTION_KEY, null);

  if (!field) {
    console.warn('useCustomFieldValue 只能在 VbenForm 的表单项内部使用');
    return {
      disabled: computed(() => false),
      error: computed(() => undefined),
      fieldName: undefined,
      resetValidation: () => {},
      value: computed(() => undefined),
    };
  }

  // 一个字段只能有一个值来源，后来者会互相覆盖
  if (field.customValue.value) {
    console.warn(
      `表单项 ${field.fieldName} 已存在自定义取值函数，本次注册被忽略`,
    );
  } else {
    field.customValue.value = customValue;

    onUnmounted(() => {
      if (field.customValue.value === customValue) {
        field.customValue.value = undefined;
      }
    });

    // deep 时组件原地改的就是这个对象，存一份副本进表单，
    // 下次比较才不是拿它跟自己比，原地改动也就不会被当成没变
    const toFormValue = (value: T) =>
      options.deep ? cloneDeep(toRaw(value)) : value;

    if (options.immediate) {
      field.setValue(toFormValue(customValue()));
    }

    watch(
      customValue,
      (value) => {
        // 组件由表单驱动（v-model / componentProps）时，setValues、重置下发的新值
        // 会经组件再流回这里，此时值与表单一致：不重复写回，也不触发校验，
        // 否则一点重置就立刻冒出必填错误
        if (isEqual(value, toRaw(field.value.value))) {
          return;
        }
        field.setValue(toFormValue(value));
        field.resetValidation();
        field.validateWithTrigger('change');
      },
      { deep: options.deep },
    );
  }

  return {
    disabled: field.disabled,
    error: field.error,
    fieldName: field.fieldName,
    resetValidation: field.resetValidation,
    value: computed(() => field.value.value as T | undefined),
  };
}
