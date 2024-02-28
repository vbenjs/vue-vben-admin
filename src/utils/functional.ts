// import type { Options, Props } from './typing';
import ImgPreview from './Functional.vue';
import { isClient } from '@/utils/is';
import { createVNode, render } from 'vue';

//   export const modalTitle = '盒码';
// export type ActionKey = 'create' | 'edit';
// export const createApi = () => {};
// export const updateApi = () => {};
// export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {

let instance: ReturnType<typeof createVNode> | null = null;
export function createModal(options: Options) {
  if (!isClient) return;
  const propsData: Partial<Props> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true }, options);

  instance = createVNode(ImgPreview, propsData);
  render(instance, container);
  document.body.appendChild(container);
  return instance.component?.exposed;
}
