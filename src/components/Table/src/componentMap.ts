import type { Component } from 'vue';

import { Input, Select, Checkbox, InputNumber, Switch } from 'ant-design-vue';

import type { ComponentType } from './types/componentType';
import { ApiSelect } from '/@/components/Form';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputNumber', InputNumber);

componentMap.set('Select', Select);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
