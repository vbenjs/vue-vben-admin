import type { Component } from 'vue';
import {
  Input,
  Select,
  Checkbox,
  InputNumber,
  Switch,
  DatePicker,
  TimePicker,
  AutoComplete,
  Radio,
} from 'ant-design-vue';
import type { ComponentType } from './types/componentType';
import { ApiSelect, ApiTreeSelect, RadioButtonGroup, ApiRadioGroup } from '@/components/Form';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('AutoComplete', AutoComplete);
componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('DatePicker', DatePicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('ApiRadioGroup', ApiRadioGroup);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
