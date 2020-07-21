import ImgPreview from './index.vue';
import { Vue } from 'compatible-vue';

import { Options, Instance } from './types';
const PreviewConstructor = Vue.extend(ImgPreview as any);
const instance = (new PreviewConstructor().$mount() as unknown) as Instance;

export function createImgPreview(options: Options) {
  const { imageList, show = true, index = 0 } = options;
  instance.imageList = imageList;
  instance.show = show;
  instance.index = index;
  instance.instance = instance;
  document.body.appendChild(instance.$el);
}
