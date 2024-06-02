interface RouteMeta {
  /**
   * 是否固定标签页
   * @default false
   */
  affixTab?: boolean;
  /**
   * 需要特定的角色标识才可以访问
   * @default []
   */
  authority?: string[];
  /**
   * 徽标
   */
  badge?: string;
  /**
   * 徽标类型
   */
  badgeType?: 'dot' | 'normal';
  /**
   * 徽标颜色
   */
  badgeVariants?:
    | 'default'
    | 'destructive'
    | 'primary'
    | 'success'
    | 'warning'
    | string;
  /**
   * 当前路由的子级在菜单中不展现
   * @default false
   */
  hideChildrenInMenu?: boolean;
  /**
   * 当前路由在面包屑中不展现
   * @default false
   */
  hideInBreadcrumb?: boolean;
  /**
   * 当前路由在菜单中不展现
   * @default false
   */
  hideInMenu?: boolean;

  /**
   * 当前路由在标签页不展现
   * @default false
   */
  hideInTab?: boolean;
  /**
   * 路由跳转地址
   */
  href?: string;
  /**
   * 图标（菜单/tab）
   */
  icon?: string;
  /**
   * iframe 地址
   */
  iframeSrc?: string;
  /**
   * 忽略权限，直接可以访问
   * @default false
   */
  ignoreAccess?: boolean;
  /**
   * 开启KeepAlive缓存
   */
  keepAlive?: boolean;
  /**
   * 路由是否已经加载过
   */
  loaded?: boolean;
  /**
   * 用于路由->菜单排序
   */
  orderNo?: number;
  /**
   * 外链-跳转路径
   */
  target?: string;
  /**
   * 标题名称
   */
  title: string;
}

export type { RouteMeta };
