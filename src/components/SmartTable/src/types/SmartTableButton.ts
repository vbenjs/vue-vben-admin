import type { ButtonProps } from '@/components/Button';
import type { Component, ComputedRef, Ref, VNode } from 'vue';
import type { SmartAuth } from '#/utils';
import type { VxeToolbarPropTypes } from 'vxe-table';

export type SmartTableButtonType = 'text' | 'submit' | 'reset' | 'button';

export type SmartTableButtonStatus = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export type SmartTableButtonCode =
  | 'reload'
  | 'query'
  | 'insert'
  | 'insert_actived'
  | 'mark_cancel'
  | 'delete'
  | 'remove'
  | 'save'
  | 'import'
  | 'open_import'
  | 'export'
  | 'open_export'
  | 'reset_custom'
  | 'ModalAdd'
  | 'ModalEdit'
  | 'useYnTrue'
  | 'useYnFalse';

export type SmartTableToolCode = 'show_search';

export type SmartTableButtonCustomRender = 'ant' | 'element';

export interface SmartTableButtonRender {
  name?: string;
  props?: any;
  events?: any;
}

export interface SmartTableBasicButtonDropdowns {
  name?: string | 'smart-auto';
  // 按钮类型
  type?: SmartTableButtonType;
  // 按钮状态
  status?: SmartTableButtonStatus;
  code?: SmartTableButtonCode;
  visible?: boolean;
  disabled?: boolean | ComputedRef<boolean>;
  icon?: string;
  round?: boolean;
  circle?: boolean;
  auth?: string | SmartAuth;
}

export interface SmartTableButton extends SmartTableBasicButtonDropdowns {
  placement?: string;
  'destroy-on-close'?: boolean;
  transfer?: boolean;
  dropdowns?: SmartTableBasicButtonDropdowns[];
  buttonRender?: SmartTableButtonRender;
  props?: ButtonProps | Ref<ButtonProps> | ComputedRef<ButtonProps>;
  // 是否是ant-design按钮，false：使用vxe-table原有的按钮，true使用VxeTableToolButtonRenderer进行渲染
  customRender?: SmartTableButtonCustomRender;
  // 点击事件是否触发加载状态
  clickLoading?: boolean;
  // 是否使用插槽
  slot?: (button: SmartTableButton & ButtonProps) => VNode | string;
}

export interface SmartTableToolbarTool extends VxeToolbarPropTypes.ToolConfig {
  code?: SmartTableToolCode | string;

  props?: Recordable;

  component?: Component;
}
