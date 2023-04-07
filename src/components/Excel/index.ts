import { withInstall } from '@/utils';

import expExcelModal from './src/ExportExcelModal.vue';
import impExcel from './src/ImportExcel.vue';

export const ImpExcel = withInstall(impExcel);
export const ExpExcelModal = withInstall(expExcelModal);
export { aoaToSheetXlsx, jsonToSheetXlsx } from './src/Export2Excel';
export * from './src/typing';
