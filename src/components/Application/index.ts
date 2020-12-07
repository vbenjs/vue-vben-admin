import AppLocalePicker from './src/AppLocalePicker.vue';
import AppLogo from './src/AppLogo.vue';
import AppProvider from './src/AppProvider.vue';
import { withInstall } from '../util';

withInstall(AppLocalePicker, AppLogo, AppProvider);

export { useAppProviderContext } from './src/useAppContext';

export { AppLocalePicker, AppLogo, AppProvider };
