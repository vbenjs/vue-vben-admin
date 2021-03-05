import Icon from './src/index.vue';
import SvgIcon from './src/SvgIcon.vue';
// import IconPicker from './src/IconPicker.vue';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

const IconPicker = createAsyncComponent(() => import('./src/IconPicker.vue'));

export { Icon, IconPicker, SvgIcon };

export default Icon;
