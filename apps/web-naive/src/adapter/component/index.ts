/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { BaseFormComponentType } from '@vben/common-ui';

import type { Component, SetupContext } from 'vue';
import { h } from 'vue';

import { globalShareState } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NInput,
  NInputNumber,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTimePicker,
  NTreeSelect,
  NUpload,
} from 'naive-ui';

import { message } from '#/adapter/naive';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'RadioGroup'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    Checkbox: NCheckbox,
    CheckboxGroup: NCheckboxGroup,
    DatePicker: NDatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(NButton, { ...props, attrs, type: 'default' }, slots);
    },
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(NButton, { ...props, attrs, type: 'primary' }, slots);
    },
    Divider: NDivider,
    Input: withDefaultPlaceholder(NInput, 'input'),
    InputNumber: withDefaultPlaceholder(NInputNumber, 'input'),
    RadioGroup: NRadioGroup,
    Select: withDefaultPlaceholder(NSelect, 'select'),
    Space: NSpace,
    Switch: NSwitch,
    TimePicker: NTimePicker,
    TreeSelect: withDefaultPlaceholder(NTreeSelect, 'select'),
    Upload: NUpload,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      message.success(content || title, {
        duration: 0,
      });
    },
  });
}

export { initComponentAdapter };
