import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

import BasicMenu from './src/BasicMenu.vue';

// export const BasicMenu = createAsyncComponent(() => import('./src/BasicMenu.vue'));

export const MenuTag = createAsyncComponent(() => import('./src/components/MenuItemTag.vue'));

export { BasicMenu };
