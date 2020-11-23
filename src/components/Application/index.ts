import AppLocalPicker from './src/AppLocalPicker.vue';
import AppPageFooter from './src/AppPageFooter.vue';
import AppLogo from './src/AppLogo.vue';
import { withInstall } from '../util';

export { AppLocalPicker, AppPageFooter, AppLogo };

export default withInstall(AppLocalPicker, AppPageFooter, AppLogo);
