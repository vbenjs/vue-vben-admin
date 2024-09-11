import {
  FormItemContentRenderParams,
  VxeFormItemPropTypes,
  VxeGlobalRendererHandles,
  VxeGlobalRendererOptions,
} from 'vxe-table';
import { createDefaultRender, createEditRender, createFormItemRender } from './AButton';

function createEditButtonRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderTableEditOptions,
    params: VxeGlobalRendererHandles.RenderTableEditParams,
  ) {
    const buttonEditRender = createEditRender();
    const { children } = renderOpts;
    if (children) {
      return children.map(
        (childRenderOpts: VxeGlobalRendererHandles.RenderTableEditOptions) =>
          buttonEditRender(childRenderOpts, params)[0],
      );
    }
    return [];
  };
}

function createDefaultButtonRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions,
    params: VxeGlobalRendererHandles.RenderTableDefaultParams,
  ) {
    const buttonDefaultRender = createDefaultRender();
    const { children } = renderOpts;
    if (children) {
      return children.map(
        (childRenderOpts: VxeGlobalRendererHandles.RenderDefaultOptions) =>
          buttonDefaultRender(childRenderOpts, params)[0],
      );
    }
    return [];
  };
}

function createButtonItemRender() {
  return function (
    renderOpts: VxeFormItemPropTypes.ItemRender,
    params: FormItemContentRenderParams,
  ) {
    const buttonItemRender = createFormItemRender();
    const { children } = renderOpts;
    if (children) {
      return children.map(
        (childRenderOpts: VxeFormItemPropTypes.ItemRender) =>
          buttonItemRender(childRenderOpts, params)[0],
      );
    }
    return [];
  };
}

export default {
  renderTableEdit: createEditButtonRender(),
  renderTableDefault: createDefaultButtonRender(),
  renderFormItemContent: createButtonItemRender(),
} as VxeGlobalRendererOptions;
