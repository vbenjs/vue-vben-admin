import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import AppLogo from './src/AppLogo.vue';
import AppProvider from './src/AppProvider.vue';
import { withInstall } from '../util';

export const AppLocalePicker = createAsyncComponent(() => import('./src/AppLocalePicker.vue'));
export const AppSearch = createAsyncComponent(() => import('./src/search/AppSearch.vue'), {
  loading: true,
});

export { useAppProviderContext } from './src/useAppContext';
export { AppLogo, AppProvider };

withInstall(AppLogo, AppProvider);
