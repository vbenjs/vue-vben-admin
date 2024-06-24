import { withInstall } from '@/utils';
import vxeBasicTable from './src/VxeBasicTable';
import { VxeUI } from 'vxe-table';
import VXETablePluginAntd from './src/components';
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
import ExcelJS from 'exceljs';
import './src/setting';

export const VxeBasicTable = withInstall(vxeBasicTable);
export * from 'vxe-table';
export * from './src/types';

VxeUI.use(VXETablePluginAntd).use(VXETablePluginExportXLSX, { ExcelJS });
