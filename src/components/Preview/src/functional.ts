import { isClient } from '@/utils/is';
import { createVNode, render } from 'vue';
import ImgPreview from './Functional.vue';
import type { Options, Props } from './typing';

let instance: ReturnType<typeof createVNode> | null = null;
export function createImgPreview(options: Options) {
  if (!isClient) return;
  const propsData: Partial<Props> = {};
  const container = document.createElement('div');
  Object.assign(propsData, { show: true, index: 0, scaleStep: 100 }, options);

  if (instance?.component) {
    // 存在实例时，更新props
    Object.assign(instance.component.props, propsData);
  } else {
    instance = createVNode(ImgPreview, propsData);
    render(instance, container);
    document.body.appendChild(container);
  }
  return instance.component?.exposed;
}
