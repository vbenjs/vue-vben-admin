import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

import { withInstall } from '../util';

export const ImpExcel = createAsyncComponent(() => import('./src/ImportExcel.vue'));
export const ExpExcelModel = createAsyncComponent(() => import('./src/ExportExcelModel.vue'));

withInstall(ImpExcel, ExpExcelModel);

export * from './src/types';

export { jsonToSheetXlsx, aoaToSheetXlsx } from './src/Export2Excel';
