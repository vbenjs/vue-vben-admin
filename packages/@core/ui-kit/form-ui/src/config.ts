import type { BaseFormComponentType, VbenFormAdapterOptions } from './types';

import type { Component } from 'vue';

import {
  VbenCheckbox,
  Input as VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
} from '@vben-core/shadcn-ui';

const DEFAULT_MODEL_PROP_NAME = 'modelValue';

export const COMPONENT_MAP: Record<BaseFormComponentType, Component> = {
  VbenCheckbox,
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
  const { components, config } = options;

  const modelPropName = config?.modelPropName ?? DEFAULT_MODEL_PROP_NAME;

  for (const component of Object.keys(components)) {
    const key = component as BaseFormComponentType;
    if (!COMPONENT_MAP[key]) {
      COMPONENT_MAP[key] = components[component as never];
    }

    if (
      modelPropName !== DEFAULT_MODEL_PROP_NAME &&
      !COMPONENT_BIND_EVENT_MAP[key]
    ) {
      COMPONENT_BIND_EVENT_MAP[key] = modelPropName;
    }
  }
}
