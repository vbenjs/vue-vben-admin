import { default as VbenIcon } from './Icon.vue';
import { default as VbenSvgIcon } from './SvgIcon.vue';

/** @description 这里会进行 treeshaking，无需担心全部引入 */
export * from '@ant-design/icons-vue';
export { VbenIcon, VbenSvgIcon };
