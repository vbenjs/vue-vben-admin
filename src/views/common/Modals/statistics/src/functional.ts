import type { Options, Props } from './typing';

import EquipmentStatistics from './EquipmentStatistics.vue';
import { isClient } from '@/utils/is';
import { createVNode, render } from 'vue';

let instance: ReturnType<typeof createVNode> | null = null;

export function createEquipmentStatistics(options: Options) {
  if (!isClient) return;
  const propsData: Partial<Props> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true }, options);
  instance = createVNode(EquipmentStatistics, propsData);
  render(instance, container);
  document.body.appendChild(container);
  return instance.component?.exposed;
}
