import {
  FormItemContentRenderParams,
  FormItemRenderOptions,
  VxeGlobalRendererHandles,
} from 'vxe-table';
import { createDefaultRender, createEditRender, createFormItemRender } from './AButton';

function createEditButtonRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderEditOptions,
    params: VxeGlobalRendererHandles.RenderEditParams,
  ) {
    const buttonEditRender = createEditRender();
    const { children } = renderOpts;
    if (children) {
      return children.map(
        (childRenderOpts: VxeGlobalRendererHandles.RenderEditOptions) =>
          buttonEditRender(childRenderOpts, params)[0],
      );
    }
    return [];
  };
}

function createDefaultButtonRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderDefaultOptions,
    params: VxeGlobalRendererHandles.RenderDefaultParams,
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
  return function (renderOpts: FormItemRenderOptions, params: FormItemContentRenderParams) {
    const buttonItemRender = createFormItemRender();
    const { children } = renderOpts;
    if (children) {
      return children.map(
        (childRenderOpts: FormItemRenderOptions) => buttonItemRender(childRenderOpts, params)[0],
      );
    }
    return [];
  };
}

export default {
  renderEdit: createEditButtonRender(),
  renderDefault: createDefaultButtonRender(),
  renderItemContent: createButtonItemRender(),
};
