import { VxeGlobalRendererOptions } from 'vxe-table';
import {
  createEditRender,
  createDefaultRender,
  createFilterRender,
  createDefaultFilterRender,
  createFormItemRender,
  createToolbarToolRender,
} from './common';

export default {
  renderTableDefault: createDefaultRender(),
  renderTableEdit: createEditRender(),
  renderTableFilter: createFilterRender(),
  tableFilterDefaultMethod: createDefaultFilterRender(),
  renderFormItemContent: createFormItemRender(),
  renderToolbarTool: createToolbarToolRender(),
} as VxeGlobalRendererOptions;
