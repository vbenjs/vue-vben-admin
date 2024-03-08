import { withInstall } from '@/utils';
import basicDragVerify from './src/DragVerify.vue';
import rotateDragVerify from './src/ImgRotate.vue';
import textCaptcha from './src/TextCaptcha.vue';

export const BasicDragVerify = withInstall(basicDragVerify);
export const RotateDragVerify = withInstall(rotateDragVerify);
export * from './src/typing';

export const TextCaptcha = withInstall(textCaptcha);
