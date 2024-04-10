import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

export interface ApiAddress {
  key: string;
  val: string;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  desc?: string;
  homePath?: string;
  // 租户信息
  userTenant?: UserTenant;
}

/**
 * 用户租户信息
 */
export interface UserTenant {
  tenantId: number;
  tenantCode: string;
  tenantName: string;
  tenantShortName?: string;
  platformYn: boolean;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

export interface TableSetting {
  size: Nullable<SizeType>;
  showIndexColumn: Recordable<Nullable<boolean>>;
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>;
  showRowSelection: Recordable<Nullable<boolean>>;
}

/**
 * 后台的系统参数
 */
export interface SystemProperties {
  /**
   * 是否启用验证码
   */
  captchaEnabled?: boolean;

  /**
   * 验证码类型
   */
  captchaType?: string;

  /**
   * 验证码标记
   */
  captchaIdent?: string;
}
