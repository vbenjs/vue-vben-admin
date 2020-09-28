import { DropMenu } from '/@/components/Dropdown/index';
import { AppRouteRecordRaw } from '/@/router/types';
import type { TabItem } from '/@/store/modules/tab';

export enum TabContentEnum {
  TAB_TYPE,
  EXTRA_TYPE,
}
export interface TabContentProps {
  tabItem: TabItem | AppRouteRecordRaw;
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
  // 放大
  SCALE,
}

export function getActions() {
  const REFRESH_PAGE: DropMenu = {
    icon: 'ant-design:reload-outlined',
    event: MenuEventEnum.REFRESH_PAGE,
    text: '刷新',
    disabled: false,
  };
  const CLOSE_CURRENT: DropMenu = {
    icon: 'ant-design:close-outlined',
    event: MenuEventEnum.CLOSE_CURRENT,
    text: '关闭',
    disabled: false,
    divider: true,
  };
  const CLOSE_LEFT: DropMenu = {
    icon: 'ant-design:pic-left-outlined',
    event: MenuEventEnum.CLOSE_LEFT,
    text: '关闭左侧',
    disabled: false,
    divider: false,
  };
  const CLOSE_RIGHT: DropMenu = {
    icon: 'ant-design:pic-right-outlined',
    event: MenuEventEnum.CLOSE_RIGHT,
    text: '关闭右侧',
    disabled: false,
    divider: true,
  };
  const CLOSE_OTHER: DropMenu = {
    icon: 'ant-design:pic-center-outlined',
    event: MenuEventEnum.CLOSE_OTHER,
    text: '关闭其他',
    disabled: false,
  };
  const CLOSE_ALL: DropMenu = {
    icon: 'ant-design:line-outlined',
    event: MenuEventEnum.CLOSE_ALL,
    text: '关闭全部',
    disabled: false,
  };
  return [REFRESH_PAGE, CLOSE_CURRENT, CLOSE_LEFT, CLOSE_RIGHT, CLOSE_OTHER, CLOSE_ALL];
}

export function getScaleAction(text: string, isZoom = false) {
  return {
    icon: isZoom ? 'codicon:screen-normal' : 'codicon:screen-full',
    event: MenuEventEnum.SCALE,
    text: text,
    disabled: false,
  };
}
