import { VxeGridPropTypes, VxeTablePropTypes } from 'vxe-table';
import tableProps from 'vxe-table/es/table/src/props';
import { CSSProperties } from 'vue';

/**
 * @description: table二次开发需要后，需要接受的所有prop属性
 */
export const basicProps = {
  ...tableProps,
  columns: Array as PropType<VxeGridPropTypes.Columns>,
  pagerConfig: {
    type: Object as PropType<VxeGridPropTypes.PagerConfig>,
    default: () => ({}),
  },
  proxyConfig: {
    type: Object as PropType<VxeGridPropTypes.ProxyConfig>,
    default: () => ({}),
  },
  toolbarConfig: {
    type: Object as PropType<VxeGridPropTypes.ToolbarConfig>,
    default: () => ({}),
  },
  formConfig: {
    type: Object as PropType<VxeGridPropTypes.FormConfig>,
    default: () => ({}),
  },
  zoomConfig: {
    type: Object as PropType<VxeGridPropTypes.ZoomConfig>,
    default: () => ({}),
  },
  printConfig: {
    type: Object as PropType<VxeTablePropTypes.PrintConfig>,
    default: () => ({}),
  },
  exportConfig: {
    type: Object as PropType<VxeTablePropTypes.ExportConfig>,
    default: () => ({}),
  },
  importConfig: {
    type: Object as PropType<VxeTablePropTypes.ImportConfig>,
    default: () => ({}),
  },
  size: String as PropType<VxeGridPropTypes.Size>,
  tableClass: {
    type: String,
    default: '',
  },
  tableStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
};
