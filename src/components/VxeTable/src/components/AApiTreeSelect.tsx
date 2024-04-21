import XEUtils from 'xe-utils';
import { createDefaultRender, createEditRender, createFormItemRender } from './common';

export default {
  renderDefault: createDefaultRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderEdit: createEditRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
  renderItemContent: createFormItemRender({}, (_, params) => {
    return {
      params: XEUtils.get(params, 'row'),
    };
  }),
};
