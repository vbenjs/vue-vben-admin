import { DropMenu } from '@/components/dropdown/index';
import { RouteEx } from '@/router/types';
import { TabItem } from '@/store/modules/tab';

export enum TabContentEnum {
  TAB_TYPE,
  EXTRA_TYPE,
}
export interface TabContentProps {
  tabItem: TabItem | RouteEx;
  type?: TabContentEnum;
  trigger?: Array<'click' | 'hover' | 'contextmenu'>;
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
}

export const REFRESH_PAGE: DropMenu = {
  icon: 'reload',
  event: MenuEventEnum.REFRESH_PAGE,
  text: '刷新',
  disabled: false,
};
export const CLOSE_CURRENT: DropMenu = {
  icon: 'close',
  event: MenuEventEnum.CLOSE_CURRENT,
  text: '关闭',
  disabled: false,
  divider: true,
};
export const CLOSE_LEFT: DropMenu = {
  icon: 'pic-left',
  event: MenuEventEnum.CLOSE_LEFT,
  text: '关闭左侧',
  disabled: false,
  divider: false,
};
export const CLOSE_RIGHT: DropMenu = {
  icon: 'pic-right',
  event: MenuEventEnum.CLOSE_RIGHT,
  text: '关闭右侧',
  disabled: false,
  divider: true,
};
export const CLOSE_OTHER: DropMenu = {
  icon: 'pic-center',
  event: MenuEventEnum.CLOSE_OTHER,
  text: '关闭其他',
  disabled: false,
};
export const CLOSE_ALL: DropMenu = {
  icon: 'line',
  event: MenuEventEnum.CLOSE_ALL,
  text: '关闭全部',
  disabled: false,
};

// export const
