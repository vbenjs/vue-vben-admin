import VXETable, { VxeGlobalRendererHandles } from 'vxe-table';
import { SmartTableButton } from '@/components/SmartTable';
import { omit } from 'lodash-es';
import { unref, h } from 'vue';
import { isString } from '@/utils/is';
import type { ButtonProps } from '@/components/Button';
import { hasPermission } from '@/utils/auth';

export type VxeTableRenderer =
  | 'VxeTableToolButtonCustomRenderer'
  | 'VxeTableToolButtonSlotRenderer'
  | 'VxeTableToolAntRenderer'
  | 'VxeTableToolComponentRenderer';

export const VxeTableToolButtonCustomRenderer: VxeTableRenderer =
  'VxeTableToolButtonCustomRenderer';

export const VxeTableToolAntRenderer: VxeTableRenderer = 'VxeTableToolAntRenderer';

export const VxeTableToolButtonSlotRenderer: VxeTableRenderer = 'VxeTableToolButtonSlotRenderer';

export const VxeTableToolComponentRenderer: VxeTableRenderer = 'VxeTableToolComponentRenderer';

VXETable.renderer.add(VxeTableToolButtonCustomRenderer, {
  renderToolbarButton(
    _: VxeGlobalRendererHandles.RenderButtonOptions,
    params: VxeGlobalRendererHandles.RenderButtonParams,
  ): VxeGlobalRendererHandles.RenderResult {
    const button = params.button as SmartTableButton;
    let buttonPros = {
      ...button,
      ...(unref(button.props) || {}),
    };
    buttonPros = omit(buttonPros, ['props', 'buttonRender']);
    // 权限处理
    const hasAuth = hasPermission(button?.auth);
    if (!hasAuth) {
      const auth = button.auth;
      if (!isString(auth)) {
        if (auth?.displayMode === 'hide') {
          return '';
        }
      }
      buttonPros.disabled = true;
    }
    if (button.customRender === 'element') {
      return <el-button {...buttonPros}>{buttonPros.name}</el-button>;
    } else {
      return <a-button {...buttonPros}>{buttonPros.name}</a-button>;
    }
  },
});

VXETable.renderer.add(VxeTableToolAntRenderer, {
  renderToolbarTool(
    _: VxeGlobalRendererHandles.RenderToolOptions,
    params: VxeGlobalRendererHandles.RenderToolParams,
  ): VxeGlobalRendererHandles.RenderResult {
    const { tool, $grid } = params;
    const props = unref((tool as any).props);
    const handleClick = (event) => {
      ($grid as any)?.triggerToolbarTolEvent(tool, event);
    };
    return <vxe-button onClick={(event) => handleClick(event)} {...props} />;
    // return (
    //   <a-tooltip title="显示搜索">
    //     <a-button {...props} onClick={(event) => handleClick(event)} />
    //   </a-tooltip>
    // )
  },
});

/**
 * vxe-table 插槽渲染器
 */
VXETable.renderer.add(VxeTableToolButtonSlotRenderer, {
  renderToolbarButton(
    _: VxeGlobalRendererHandles.RenderButtonOptions,
    params: VxeGlobalRendererHandles.RenderButtonParams,
  ): VxeGlobalRendererHandles.RenderResult {
    const button = params.button as SmartTableButton & ButtonProps;
    if (!button.slot || isString(button.slot)) {
      return '';
    }
    return button.slot(button);
  },
});

/**
 * 自定义组件渲染
 */
VXETable.renderer.add(VxeTableToolComponentRenderer, {
  renderToolbarTool(
    { props }: VxeGlobalRendererHandles.RenderToolOptions,
    { tool }: VxeGlobalRendererHandles.RenderToolParams<any>,
  ): VxeGlobalRendererHandles.RenderResult {
    return h((tool as any).component, props);
  },
});
