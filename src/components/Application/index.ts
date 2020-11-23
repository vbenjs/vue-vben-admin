import AppLocalPicker from './src/AppLocalPicker.vue';
import AppFooterToolbar from './src/AppFooterToolbar.vue';
import { withInstall } from '../util';

export { AppLocalPicker, AppFooterToolbar };

export default withInstall(AppLocalPicker, AppFooterToolbar);
