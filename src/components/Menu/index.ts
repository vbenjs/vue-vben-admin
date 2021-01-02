import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const BasicMenu = createAsyncComponent(() => import('./src/BasicMenu.vue'));

export const MenuTag = createAsyncComponent(() => import('./src/components/MenuItemTag.vue'));
