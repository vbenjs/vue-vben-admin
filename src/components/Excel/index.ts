import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const ImpExcel = createAsyncComponent(() => import('./src/ImportExcel.vue'));
export const ExpExcelModel = createAsyncComponent(() => import('./src/ExportExcelModel.vue'));

export * from './src/types';

export { jsonToSheetXlsx, aoaToSheetXlsx } from './src/Export2Excel';
