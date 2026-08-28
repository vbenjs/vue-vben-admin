import type { Component } from 'vue';

import type {
  BaseFormComponentType,
  FormCommonConfig,
  VbenFormAdapterOptions,
} from './types';

import { h } from 'vue';

import {
  VbenButton,
  VbenCheckbox,
  Input as VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
} from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';

import VbenFormFieldArray from './components/form-field-array.vue';
import { warnDeprecatedOnce } from './deprecation';
import { registerFormRules } from './rule-registry';

const DEFAULT_MODEL_PROP_NAME = 'modelValue';

export const DEFAULT_FORM_COMMON_CONFIG: FormCommonConfig = {};

const BUILT_IN_COMPONENT_MAP: Record<BaseFormComponentType, Component> = {
  DefaultButton: h(VbenButton, { size: 'sm', variant: 'outline' }),
  PrimaryButton: h(VbenButton, { size: 'sm', variant: 'default' }),
  VbenCheckbox,
  VbenFormFieldArray,
  VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
};

const BUILT_IN_COMPONENT_BIND_EVENT_MAP: Partial<
  Record<BaseFormComponentType, string>
> = {
  VbenCheckbox: 'checked',
};

export const COMPONENT_MAP: Record<BaseFormComponentType, Component> = {
  ...BUILT_IN_COMPONENT_MAP,
};

export const COMPONENT_BIND_EVENT_MAP: Partial<
  Record<BaseFormComponentType, string>
> = {
  ...BUILT_IN_COMPONENT_BIND_EVENT_MAP,
};

function replaceRecord<T extends object>(target: T, source: T) {
  for (const key of Object.keys(target)) {
    Reflect.deleteProperty(target, key);
  }
  Object.assign(target, source);
}

export function setupVbenForm<
  T extends BaseFormComponentType = BaseFormComponentType,
>(options: VbenFormAdapterOptions<T>) {
  const { config, defineRules, rules } = options;

  const { changeEventFallback = false, emptyStateValue = undefined } =
    (config || {}) as FormCommonConfig;

  Object.assign(DEFAULT_FORM_COMMON_CONFIG, {
    changeEventFallback,
    emptyStateValue,
  });

  if (defineRules) {
    warnDeprecatedOnce(
      'setup-vben-form-define-rules',
      '[Vben Form] `setupVbenForm({ defineRules })` is deprecated. Use `setupVbenForm({ rules })` instead.',
    );
    registerFormRules(defineRules);
  }
  if (rules) {
    registerFormRules(rules);
  }

  const baseModelPropName =
    config?.baseModelPropName ?? DEFAULT_MODEL_PROP_NAME;
  const modelPropNameMap = config?.modelPropNameMap as
    | Record<BaseFormComponentType, string>
    | undefined;

  const components = globalShareState.getComponents();
  const nextComponentMap = {
    ...BUILT_IN_COMPONENT_MAP,
    ...components,
  } as Record<BaseFormComponentType, Component>;
  const nextBindEventMap = {
    ...BUILT_IN_COMPONENT_BIND_EVENT_MAP,
  } as Partial<Record<BaseFormComponentType, string>>;

  for (const component of Object.keys(components)) {
    const key = component as BaseFormComponentType;

    if (baseModelPropName !== DEFAULT_MODEL_PROP_NAME) {
      nextBindEventMap[key] = baseModelPropName;
    }

    // 覆盖特殊组件的modelPropName
    if (modelPropNameMap && modelPropNameMap[key]) {
      nextBindEventMap[key] = modelPropNameMap[key];
    }
  }

  replaceRecord(COMPONENT_MAP, nextComponentMap);
  replaceRecord(COMPONENT_BIND_EVENT_MAP, nextBindEventMap);
}
