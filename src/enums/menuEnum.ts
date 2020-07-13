/**
 * 菜单生成方式
 */
export enum BuildTypeEnum {
  // 基于角色
  ROLE,
  // 基于后台
  BACK,
}

/**
 * @description: 菜单类型
 */
export enum MenuTypeEnum {
  // 左侧菜单模式
  SIDEBAR = 'sidebar',
  // 混合菜单模式
  MIX = 'mix',
  // 顶部菜单模式
  TOP_MENU = 'top-menu',

  TREE = 'tree',
}

// 菜单主题
export enum MenuThemeEnum {
  // 黑暗
  DARK = 'dark',

  // 白
  LIGHT = 'light',
}

export type Mode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline';

// 菜单模式
export enum MenuModeEnum {
  // 垂直
  VERTICAL = 'vertical',
  // 水平
  HORIZONTAL = 'horizontal',
  // 垂直向右
  VERTICAL_RIGHT = 'vertical-right',
  // 内联模式
  INLINE = 'inline',
}
