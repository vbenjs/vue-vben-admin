import { VxeGlobalRendererOptions } from 'vxe-table';
import {
  createEditRender,
  createDefaultRender,
  createFilterRender,
  createDefaultFilterRender,
  createFormItemRender,
} from './common';

export default {
  tableAutoFocus: 'input.ant-input',
  renderTableDefault: createDefaultRender(),
  renderTableEdit: createEditRender(),
  renderTableFilter: createFilterRender(),
  tableFilterDefaultMethod: createDefaultFilterRender(),
  renderFormItemContent: createFormItemRender(),
} as VxeGlobalRendererOptions;
