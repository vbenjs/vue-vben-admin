import { withInstall } from '@/utils';
import basicDragVerify from './src/DragVerify.vue';
import rotateDragVerify from './src/ImgRotate.vue';

export const BasicDragVerify = withInstall(basicDragVerify);
export const RotateDragVerify = withInstall(rotateDragVerify);
export * from './src/typing';

export { default as TextCaptcha } from './src/TextCaptcha.vue';
export { default as ImageCaptcha } from './src/ImageCaptcha.vue';
export { default as ImageCaptchaModal } from './src/ImageCaptchaModal.vue';
