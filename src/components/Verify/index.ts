import BasicDragVerifyLib from './src/DragVerify';
import RotateDragVerifyLib from './src/ImgRotate';
import { withInstall } from '../util';

export * from './src/types';

export const RotateDragVerify = withInstall(RotateDragVerifyLib);
export const BasicDragVerify = withInstall(BasicDragVerifyLib);
