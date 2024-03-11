import { withInstall } from '@/utils';
import statusSwitch from './src/StatusSwitch.vue';
import modalSelect from './src/ModalSelect/index.vue';
import fIcon from './src/FIcon.vue';
import rangePicker from './src/RangePicker.vue';

export const StatusSwitch = withInstall(statusSwitch);
export const ModalSelect = withInstall(modalSelect);
export * from './src/ModalSelect';
export const FIcon = withInstall(fIcon);
// eslint-disable-next-line no-var
export var RangePicker = withInstall(rangePicker);
