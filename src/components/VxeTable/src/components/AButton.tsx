import { h } from 'vue';
import {
  FormItemContentRenderParams,
  VxeFormItemPropTypes,
  VxeGlobalRendererHandles,
  VxeGlobalRendererOptions,
} from 'vxe-table';
import XEUtils from 'xe-utils';
import { cellText, createEvents, createProps, getComponent } from './common';

const COMPONENT_NAME = 'AButton';

export function createEditRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderTableEditOptions,
    params: VxeGlobalRendererHandles.RenderTableEditParams,
  ) {
    const { attrs } = renderOpts;
    const Component = getComponent(COMPONENT_NAME);

    return [
      h(Component, {
        ...attrs,
        ...createProps(renderOpts, null),
        ...createEvents(renderOpts, params),
      }),
    ];
  };
}

export function createDefaultRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderTableEditOptions,
    params: VxeGlobalRendererHandles.RenderTableEditParams,
  ) {
    const { attrs } = renderOpts;
    const Component = getComponent(COMPONENT_NAME);

    return [
      h(
        Component,
        {
          ...attrs,
          ...createProps(renderOpts, null),
          ...createEvents(renderOpts, params),
        },
        cellText(renderOpts.content),
      ),
    ];
  };
}

export function createFormItemRender() {
  return function (
    renderOpts: VxeFormItemPropTypes.ItemRender,
    params: FormItemContentRenderParams,
  ) {
    const { attrs, content } = renderOpts;
    const { property, $form, data } = params;
    const props = createProps(renderOpts, null);
    const Component = getComponent(COMPONENT_NAME);

    return [
      h(
        Component,
        {
          ...attrs,
          ...props,
          ...createEvents(
            renderOpts,
            params,
            (value: any) => {
              // 处理 model 值双向绑定
              XEUtils.set(data, property, value);
            },
            () => {
              // 处理 change 事件相关逻辑
              $form.updateStatus({
                ...params,
                field: property,
              });
            },
          ),
        },
        {
          default: () => cellText(content || props.content),
        },
      ),
    ];
  };
}

function createToolbarButtonRender() {
  return function (
    renderOpts: VxeGlobalRendererHandles.RenderToolOptions,
    params: VxeGlobalRendererHandles.RenderButtonParams,
  ) {
    const { attrs } = renderOpts;
    const { button } = params;
    const props = createProps(renderOpts, null);
    const Component = getComponent(COMPONENT_NAME);

    return [
      h(
        Component,
        {
          ...attrs,
          ...props,
          ...createEvents(renderOpts, params),
        },
        {
          default: () => cellText(button?.content || props.content),
        },
      ),
    ];
  };
}

export default {
  renderTableEdit: createEditRender(),
  renderTableDefault: createDefaultRender(),
  renderFormItemContent: createFormItemRender(),
  renderToolbarButton: createToolbarButtonRender(),
} as VxeGlobalRendererOptions;
