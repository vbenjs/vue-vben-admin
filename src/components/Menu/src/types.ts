export type Key = string | number;
export interface MenuState {
  // 默认选中的列表
  defaultSelectedKeys: Key[];

  // 缩进
  inlineIndent?: number;

  // 展开数组
  openKeys: Key[];

  // 当前选中的菜单项 key 数组
  selectedKeys: Key[];

  // 收缩状态下展开的数组
  collapsedOpenKeys: Key[];
}
