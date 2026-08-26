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

export const COMPONENT_MAP: Record<BaseFormComponentType, Component> = {
  DefaultButton: h(VbenButton, { size: 'sm', variant: 'outline' }),
  PrimaryButton: h(VbenButton, { size: 'sm', variant: 'default' }),
  VbenCheckbox,
  VbenFormFieldArray,
  VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
};

export const COMPONENT_BIND_EVENT_MAP: Partial<
  Record<BaseFormComponentType, string>
> = {
  VbenCheckbox: 'checked',
};

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

  for (const component of Object.keys(components)) {
    const key = component as BaseFormComponentType;
    const registeredComponent = components[component as never];
    COMPONENT_MAP[key] = registeredComponent;

    // 优先级：组件定义处挂载的协议 > setup 配置的 modelPropNameMap > 全局默认协议
    const componentModelPropName = (
      registeredComponent as undefined | { modelPropName?: string }
    )?.modelPropName;

    if (componentModelPropName) {
      COMPONENT_BIND_EVENT_MAP[key] = componentModelPropName;
    } else if (modelPropNameMap && modelPropNameMap[key]) {
      COMPONENT_BIND_EVENT_MAP[key] = modelPropNameMap[key];
    } else if (baseModelPropName !== DEFAULT_MODEL_PROP_NAME) {
      COMPONENT_BIND_EVENT_MAP[key] = baseModelPropName;
    }
  }
}
