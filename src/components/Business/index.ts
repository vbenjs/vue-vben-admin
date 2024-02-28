import { withInstall } from '@/utils';
import statusSwitch from './src/StatusSwitch.vue';
import modalSelect from './src/ModalSelect/index.vue';
import fIcon from './src/FIcon.vue';

export const StatusSwitch = withInstall(statusSwitch);
export const ModalSelect = withInstall(modalSelect);
export const FIcon = withInstall(fIcon);
export { default as RangePicker } from './src/RangePicker.vue';
