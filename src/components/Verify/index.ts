import BasicDragVerify from './src/DragVerify';
import RotateDragVerify from './src/ImgRotate';
import { withInstall } from '../util';

withInstall(BasicDragVerify, RotateDragVerify);

export * from './src/types';

export { BasicDragVerify, RotateDragVerify };
