import {
  createEditRender,
  createFilterRender,
  createFormItemRender,
  createDefaultFilterRender,
  createDefaultRender,
} from './common';

export default {
  autofocus: 'input.ant-input-number-input',
  renderDefault: createDefaultRender(),
  renderEdit: createEditRender(),
  renderFilter: createFilterRender(),
  defaultFilterMethod: createDefaultFilterRender(),
  renderItemContent: createFormItemRender(),
};
