import { VXETable } from 'vxe-table';
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';

import componentSetting from '@/settings/componentSetting';
import { withInstall } from '@/utils';

import VXETablePluginAntd from './src/components';
import vxeBasicTable from './src/VxeBasicTable';

export const VxeBasicTable = withInstall(vxeBasicTable);
export * from './src/types';
export * from 'vxe-table';

VXETable.use(VXETablePluginAntd).use(VXETablePluginExportXLSX);
VXETable.setup(componentSetting.vxeTable);
