/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { Component } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { defineComponent, getCurrentInstance, h, ref } from 'vue';

import { ApiComponent, globalShareState, IconPicker } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  notification,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
  Upload,
} from 'ant-design-vue';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return defineComponent({
    inheritAttrs: false,
    name: component.name,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      const publicApi: Recordable<any> = {};
      expose(publicApi);
      const instance = getCurrentInstance();
      instance?.proxy?.$nextTick(() => {
        for (const key in innerRef.value) {
          if (typeof innerRef.value[key] === 'function') {
            publicApi[key] = innerRef.value[key];
          }
        }
      });
      return () =>
        h(component, { ...props, ...attrs, placeholder, ref: innerRef }, slots);
    },
  });
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: Select,
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    ApiTreeSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: TreeSelect,
          fieldNames: { label: 'label', value: 'value', children: 'children' },
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          optionsPropName: 'treeData',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      );
    },
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    IconPicker: (props, { attrs, slots }) => {
      return h(
        IconPicker,
        {
          iconSlot: 'addonAfter',
          inputComponent: Input,
          modelValueProp: 'value',
          ...props,
          ...attrs,
        },
        slots,
      );
    },
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
