import { VxeGlobalRendererOptions } from 'vxe-table';
import {
  createEditRender,
  createFilterRender,
  createFormItemRender,
  createDefaultFilterRender,
  createDefaultRender,
} from './common';

export default {
  tableAutoFocus: 'input.ant-input-number-input',
  renderTableDefault: createDefaultRender(),
  renderTableEdit: createEditRender(),
  renderTableFilter: createFilterRender(),
  tableFilterDefaultMethod: createDefaultFilterRender(),
  renderFormItemContent: createFormItemRender(),
} as VxeGlobalRendererOptions;
