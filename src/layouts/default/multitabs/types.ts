import type { DropMenu } from '/@/components/Dropdown/index';
import type { RouteLocationNormalized } from 'vue-router';

export enum TabContentEnum {
  TAB_TYPE,
  EXTRA_TYPE,
}

export type { DropMenu };

export interface TabContentProps {
  tabItem: RouteLocationNormalized;
  type?: TabContentEnum;
  trigger?: ('click' | 'hover' | 'contextmenu')[];
}

/**
 * @description: 右键：下拉菜单文字
 */
export enum MenuEventEnum {
  // 刷新
  REFRESH_PAGE,
  // 关闭当前
  CLOSE_CURRENT,
  // 关闭左侧
  CLOSE_LEFT,
  // 关闭右侧
  CLOSE_RIGHT,
  // 关闭其他
  CLOSE_OTHER,
  // 关闭所有
  CLOSE_ALL,
  // 放大
  SCALE,
}
