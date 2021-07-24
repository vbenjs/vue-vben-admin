import type { Options, Props } from './typing';
import ImgPreview from './Functional.vue';
import { isClient } from '/@/utils/is';
import { createVNode, render } from 'vue';

let instance: ReturnType<typeof createVNode> | null = null;
export function createImgPreview(options: Options) {
  if (!isClient) return;
  const { imageList, show = true, index = 0 } = options;

  const propsData: Partial<Props> = {};
  const container = document.createElement('div');
  propsData.imageList = imageList;
  propsData.show = show;
  propsData.index = index;

  instance = createVNode(ImgPreview, propsData);
  render(instance, container);
  document.body.appendChild(container);
}
