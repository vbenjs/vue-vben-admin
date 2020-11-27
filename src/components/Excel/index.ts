import ImportExcelLib from './src/ImportExcel.vue';
import ExportExcelModelLib from './src/ExportExcelModel.vue';

import { withInstall } from '../util';

export * from './src/types';

export { jsonToSheetXlsx, aoaToSheetXlsx } from './src/Export2Excel';

export const ImportExcel = withInstall(ImportExcelLib);
export const ExportExcelModel = withInstall(ExportExcelModelLib);
