import AppLocalePicker from './src/AppLocalePicker.vue';
import AppPageFooter from './src/AppPageFooter.vue';
import AppLogo from './src/AppLogo.vue';
import { withInstall } from '../util';

export { AppLocalePicker, AppPageFooter, AppLogo };

export default withInstall(AppLocalePicker, AppPageFooter, AppLogo);
