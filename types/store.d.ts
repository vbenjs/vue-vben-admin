import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { RoleInfo } from '/@/api/sys/model/userModel';

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

// export interface UserInfo {
//   userId: string | number;
//   username: string;
//   realName: string;
//   avatar: string;
//   desc?: string;
//   homePath?: string;
//   roles: RoleInfo[];
// }
export interface UserInfo {
  // 人员id
  ryid: string;
  // 所属法院
  fjm: string;
  // 手机号码
  sjhm: string | number;
  // 用户名
  ryxm: string;
  // 人员类型
  rylx: string;
  // 人员类型名称
  rylxmc: string;
  homePath?: string;
  roles: RoleInfo[];
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
