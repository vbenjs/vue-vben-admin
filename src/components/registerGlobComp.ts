import type { App } from 'vue';
import { Button } from './Button';
import {
  Input,
  Layout,
  Radio,
  Tag,
  Select,
  Tooltip,
  Tree,
  Tabs,
  Switch,
  Form,
  Checkbox,
  InputNumber,
} from 'ant-design-vue';
import VXETable from 'vxe-table';

import ExcelJS from 'exceljs';
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
import { VXETablePluginAntd } from '@/components/SmartTable/VXETablePluginAntd';

import { i18n } from '@/locales/setupI18n';

export function registerGlobComp(app: App) {
  VXETable.setup({
    // @ts-ignore
    i18n: (key, args) => {
      // @ts-ignore
      return i18n.global.t(key, args);
    },
    translate(key: string, args?: any): string {
      if (key.startsWith('{') && key.endsWith('}')) {
        const i18nKey = key.replace('{', '').replace('}', '');
        // @ts-ignore
        return i18n.global.t(i18nKey, args);
      }
      return key;
    },
  });
  VXETable.use(VXETablePluginAntd);
  VXETable.use(VXETablePluginExportXLSX, {
    ExcelJS,
  });
  app
    .use(Input)
    .use(Button)
    .use(Layout)
    .use(Radio)
    .use(Tag)
    .use(Select)
    .use(Tooltip)
    .use(Tree)
    .use(Tabs)
    .use(Switch)
    .use(InputNumber)
    .use(Form)
    .use(Checkbox)
    .use(VXETable);
}
