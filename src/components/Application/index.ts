import { withInstall } from '../util';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const AppLocalePicker = createAsyncComponent(() => import('./src/AppLocalePicker.vue'), {
  loading: true,
});
export const AppProvider = createAsyncComponent(() => import('./src/AppProvider.vue'));
export const AppSearch = createAsyncComponent(() => import('./src/search/AppSearch.vue'), {
  loading: true,
});
export const AppLogo = createAsyncComponent(() => import('./src/AppLogo.vue'));

withInstall(AppLocalePicker, AppLogo, AppProvider, AppSearch);

export { useAppProviderContext } from './src/useAppContext';
