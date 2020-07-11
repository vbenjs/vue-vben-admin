import { ComputedRef } from '@/setup/vue';

import { MenuModeEnum, MenuThemeEnum, MenuTypeEnum } from '@/enums/menuEnum';
// import { BuildMenuModuleResult } from '@/router/menus/_type';

/**
 * @description:  菜单状态
 */
export interface MenuState {
  // 默认选中的列表
  defaultSelectedKeys: string[];

  // 模式
  mode: MenuModeEnum;

  // 主题
  theme: ComputedRef<MenuThemeEnum> | MenuThemeEnum;

  // 缩进
  inlineIndent?: number;

  // 展开数组
  openKeys: string[];

  // 搜索值
  searchValue: string;

  // 当前选中的菜单项 key 数组
  selectedKeys: string[];

  // 收缩状态下展开的数组
  collapsedOpenKeys: string[];
}

/**
 * @description: tree结构；类似
 */
export interface MenuTreeItem {
  id: string;

  parentId: string;
  // 菜单名
  name: string;

  // 菜单图标
  icon?: string;

  // 菜单路径
  path?: string;

  // 是否禁用
  disabled?: boolean;

  // 子菜单
  children?: MenuTreeItem[];

  orderNo?: number;
}
export interface MenuProps {
  // 是否显示搜索
  search: boolean;
  // 菜单生成函数
  buildMenuFn: () => Promise<MenuTreeItem[]>;
  // 菜单mode
  mode: MenuModeEnum;
  // 菜单类型
  type: MenuTypeEnum;

  // 菜单主题
  theme: MenuThemeEnum;
  // 手风琴模式
  accordion: boolean;
  showLogo: boolean;
}

export interface MenuData {
  allMenus: MenuTreeItem[];
  flatMenus: MenuTreeItem[];
}
