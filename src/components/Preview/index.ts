export { createImgPreview } from './src/functional';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
export const ImagePreview = createAsyncComponent(() => import('./src/index.vue'));
