import { SmartAuth, SmartAuthDisplayMode } from '#/utils';

type SmartTableAuth = string | SmartAuth;

/**
 * smart-table auth配置
 */
export interface SmartTableAuthConfig {
  toolbar?: SmartTableAuthToolbarConfig;
  /**
   * 判断权限函数
   * @param auth
   */
  authHandler: (auth?: SmartAuth | string) => boolean;
  /**
   * 默认的显示模式
   */
  displayMode?: SmartAuthDisplayMode;
}

export interface SmartTableAuthToolbarConfig {
  query?: SmartTableAuth;
  insert?: SmartTableAuth;
  delete?: SmartTableAuth;
  remove?: SmartTableAuth;
  import?: SmartTableAuth;
  export?: SmartTableAuth;
  ModalAdd?: SmartTableAuth;
  ModalEdit?: SmartTableAuth;
}
