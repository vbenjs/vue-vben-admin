import type { Component } from 'vue';

import type { ComponentType } from './componentType';
import { ApiSelect, ApiTreeSelect } from '@/components/Form';
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Rate,
  Empty,
} from 'ant-design-vue';
import { Button } from '@/components/Button';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('AButton', Button);

componentMap.set('AInput', Input);
componentMap.set('AInputSearch', Input.Search);
componentMap.set('AInputNumber', InputNumber);
componentMap.set('AAutoComplete', AutoComplete);

componentMap.set('ASelect', Select);
componentMap.set('ATreeSelect', TreeSelect);
componentMap.set('ASwitch', Switch);
componentMap.set('ARadioGroup', Radio.Group);
componentMap.set('ACheckboxGroup', Checkbox.Group);
componentMap.set('ACascader', Cascader);
componentMap.set('ARate', Rate);

componentMap.set('ADatePicker', DatePicker);
componentMap.set('AMonthPicker', DatePicker.MonthPicker);
componentMap.set('ARangePicker', DatePicker.RangePicker);
componentMap.set('AWeekPicker', DatePicker.WeekPicker);
componentMap.set('AYearPicker', DatePicker.YearPicker);
componentMap.set('ATimePicker', TimePicker);

componentMap.set('AApiSelect', ApiSelect);
componentMap.set('AApiTreeSelect', ApiTreeSelect);

componentMap.set('AEmpty', Empty);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
