import BasicDragVerify from './src/DragVerify';
import RotateDragVerify from './src/ImgRotate';
import { withInstall } from '../util';

export * from './src/types';

export { RotateDragVerify, BasicDragVerify };

export default withInstall(RotateDragVerify, BasicDragVerify);
