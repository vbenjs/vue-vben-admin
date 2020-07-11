import {
  Component,
  RoutePropsFunction,
  Dictionary,
  RedirectOption,
  NavigationGuard,
  PathToRegexpOptions,
  RouterOptions,
  Route,
} from 'vue-router/types/router';
import { MenuModeEnum, MenuThemeEnum } from '@/enums/menuEnum';
import Router from 'vue-router';

export type NormMenuItem = Omit<MenuItem, 'id' | 'parentId'>;

export interface FormatConfig {
  menu: MenuItem | MenuItem[];
  parentPath?: string;
  parentId?: string | null;
}
export interface FormatMenuResult {
  menu: MenuItem | null;
}

export interface BuildMenuModuleResult {
  flatMenus: MenuItem[];
  allMenus: MenuItem[];
}
/**
 * @description:  菜单状态
 */
export interface MenuState {
  // 默认选中的列表
  defaultSelectedKeys: string[];

  // 展开收缩状态
  collapsed: boolean;

  // 模式
  mode: MenuModeEnum;

  // 主题
  theme: MenuThemeEnum;

  // 缩进
  inlineIndent?: number;
}

export interface MenuItem {
  id: string;

  parentId: string | null;
  // 菜单名
  name: string;

  // 菜单图标
  icon?: string;

  // 菜单路径
  path: string;

  // 是否禁用
  disabled?: boolean;

  // 子菜单
  children?: MenuItem[];

  // 排序
  orderNo?: number;
}

export interface Meta {
  // 名称
  title: string;
  // 是否忽略权限
  ignoreAuth?: boolean;
  roles?: string[];
  // 是否不缓存
  noKeepAlive?: boolean;
  // 是否固定在tab上
  affix?: boolean;
  // tab上的图标
  icon?: string;
  // 跳转地址
  frameSrc?: string;
  // 外链跳转地址
  externalLink?: string;
}
export interface RouteConfigEx {
  path: string;
  name?: string;
  redirect?: RedirectOption;
  alias?: string | string[];
  beforeEnter?: NavigationGuard;
  caseSensitive?: boolean;
  pathToRegexpOptions?: PathToRegexpOptions;
  meta?: Meta;
  children?: RouteConfigEx[];
  component?: Component | Dictionary<Component>;
  props?:
    | boolean
    | any
    | Object
    | RoutePropsFunction
    | Dictionary<boolean | Object | RoutePropsFunction>;
}
export type LayoutType = Partial<RouteConfigEx>;

export interface RouteEx extends Route {
  meta?: Meta;
}
export interface ModuleRouteConfig {
  routes: RouteConfigEx[];
  orderNo?: number;
  prefix: string;
  layout?: LayoutType;
}
// 兼容重置路由
export interface RouterOptionsPlus extends RouterOptions {
  matcher?: any;
}

export type CreateRouterOptions = Partial<RouterOptions> & Pick<RouterOptions, 'routes'>;

export interface GuardOptions {
  router: Router;
}
