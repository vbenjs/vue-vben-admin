import type { VxeGridPropTypes } from 'vxe-pc-ui';
import type { VxeGridProps } from 'vxe-table';

import type { App } from 'vue';

import VxeUI from 'vxe-pc-ui';
import VxeTable from 'vxe-table';

import { registerFormatter } from './formatter';
import { registerRenderer } from './renderer';

import 'vxe-pc-ui/lib/style.css';
import 'vxe-table/lib/style.css';

export { default as VxeTable } from './Table.vue';
export * from './type';
registerFormatter(VxeUI);
registerRenderer(VxeUI);
export type Columns<D = any> = VxeGridPropTypes.Columns<D>;
export type GridProps = VxeGridProps;
export function initVxeTable(app: App) {
  app.use(VxeTable).use(VxeUI);
}
