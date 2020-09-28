import ImgPreview from './index';
import { isClient } from '/@/utils/is';

import type { Options, Props } from './types';

import { createApp } from 'vue';

export function createImgPreview(options: Options) {
  if (!isClient) return;
  const { imageList, show = true, index = 0 } = options;

  const propsData: Partial<Props> = {};
  const wrapDom = document.createElement('div');
  propsData.imageList = imageList;
  propsData.show = show;
  propsData.index = index;
  const imgDom = createApp(ImgPreview, propsData);
  imgDom.mount(wrapDom);
  const imgPreviewDom = wrapDom.children[0];
  document.body.appendChild(imgPreviewDom);
}
