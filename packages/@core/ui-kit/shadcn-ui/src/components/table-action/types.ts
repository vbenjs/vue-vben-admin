import type { ButtonVariants } from '../../ui';

import { VbenIcon } from '../icon';

/** 权限码：单个或多个，配合注入的 hasPermission 判断 */
export type TableActionAuth = string | string[];

/** 操作按钮提示 */
export interface TableActionTooltip {
  content: string;
  side?: 'bottom' | 'left' | 'right' | 'top';
}

/** 气泡确认框配置 */
export interface TableActionPopConfirm {
  /** 取消按钮文案 */
  cancelText?: string;
  /** 确认回调；未提供时回退到 action.onClick */
  confirm?: () => void;
  /** 确认按钮文案 */
  okText?: string;
  /** 提示标题 */
  title?: string;
}

export interface ActionItem {
  /** 权限码，配合注入的 hasPermission 过滤 */
  auth?: TableActionAuth;
  /** 自定义类名 */
  class?: any;
  /** 危险操作（红色文字） */
  danger?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标组件 */
  icon?: typeof VbenIcon.icon;
  /** 是否显示：布尔或返回布尔的函数 */
  ifShow?: (() => boolean) | boolean;
  /** 唯一标识，点击回调可据此区分 */
  key?: number | string;
  /** 加载状态 */
  loading?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 气泡确认框 */
  popConfirm?: TableActionPopConfirm;
  /** 尺寸 */
  size?: ButtonVariants['size'];
  /** 文本 */
  text?: string;
  /** 提示：字符串或配置对象 */
  tooltip?: string | TableActionTooltip;
  /** 按钮样式变体 */
  variant?: ButtonVariants['variant'];
}

export interface TableActionProps {
  /** 主操作按钮 */
  actions?: ActionItem[];
  /** 对齐方式 */
  align?: 'center' | 'end' | 'start';
  /** 自定义类名 */
  class?: any;
  /** 按钮之间是否显示分割线 */
  divider?: boolean;
  /** “更多”下拉中的操作 */
  dropdownActions?: ActionItem[];
  /**
   * 权限判断函数，返回 false 则隐藏对应 auth 的操作。
   * 核心组件不依赖业务，由使用方注入（如 useAccess().hasAccessByCodes）。
   */
  hasPermission?: (auth?: TableActionAuth) => boolean;
  /** “更多”按钮文案（提供时显示在图标右侧） */
  moreText?: string;
}
