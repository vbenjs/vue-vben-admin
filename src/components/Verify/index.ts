import { withInstall } from '../util';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicDragVerify = createAsyncComponent(() => import('./src/DragVerify'));
export const RotateDragVerify = createAsyncComponent(() => import('./src/ImgRotate'));

withInstall(BasicDragVerify, RotateDragVerify);

export * from './src/types';
