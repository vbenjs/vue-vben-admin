import { VxeGlobalRendererOptions } from 'vxe-table';
import {
  createEditRender,
  createDefaultRender,
  createFilterRender,
  createDefaultFilterRender,
  createFormItemRender,
} from './common';

export default {
  renderTableDefault: createDefaultRender(),
  renderTableEdit: createEditRender(),
  renderTableFilter: createFilterRender(),
  tableFilterDefaultMethod: createDefaultFilterRender(),
  renderFormItemContent: createFormItemRender(),
} as VxeGlobalRendererOptions;
