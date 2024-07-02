import XEUtils from 'xe-utils';
import { createDefaultRender, createEditRender, createFormItemRender } from './common';
import { VxeGlobalRendererOptions } from 'vxe-table';

export default {
  renderTableDefault: createDefaultRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderTableEdit: createEditRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderFormItemContent: createFormItemRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
} as VxeGlobalRendererOptions;
