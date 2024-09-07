import type { BaseComponentType } from './types';

import type { Component } from 'vue';

import {
  VbenCheckbox,
  Input as VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
} from '@vben-core/shadcn-ui';

export const COMPONENT_MAP: Record<BaseComponentType, Component> = {
  VbenCheckbox,
  VbenInput,
  VbenInputPassword,
  VbenPinInput,
  VbenSelect,
};

export const COMPONENT_BIND_EVENT_MAP: Partial<
  Record<BaseComponentType, string>
> = {
  VbenCheckbox: 'checked',
};
