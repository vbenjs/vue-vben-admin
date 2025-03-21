import type { AsTag } from 'radix-vue';

import type { Component } from 'vue';

import type { ButtonVariants, ButtonVariantSize } from '../../ui';

export interface VbenButtonProps {
  /**
   * The element or component this component should render as. Can be overwrite by `asChild`
   * @defaultValue "div"
   */
  as?: AsTag | Component;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * Read our [Composition](https://www.radix-vue.com/guides/composition.html) guide for more details.
   */
  asChild?: boolean;
  class?: any;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonVariantSize;
  variant?: ButtonVariants;
}

export type CustomRenderType = (() => Component | string) | string;

export type ValueType = boolean | number | string;

export interface VbenButtonGroupProps
  extends Pick<VbenButtonProps, 'disabled'> {
  beforeChange?: (
    value: ValueType,
    isChecked: boolean,
  ) => boolean | PromiseLike<boolean | undefined> | undefined;
  btnClass?: any;
  gap?: number;
  multiple?: boolean;
  options?: { label: CustomRenderType; value: ValueType }[];
  showIcon?: boolean;
  size?: 'large' | 'middle' | 'small';
}
