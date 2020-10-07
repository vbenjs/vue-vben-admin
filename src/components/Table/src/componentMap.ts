import { Component } from 'vue';

import { Input, Select, Checkbox, InputNumber, Switch } from 'ant-design-vue';

import { ComponentType } from './types/componentType';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputNumber', InputNumber);

componentMap.set('Select', Select);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
