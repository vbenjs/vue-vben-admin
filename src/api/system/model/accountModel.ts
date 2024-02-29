import { RoleResult } from './roleModel';
import { YN } from '@/enums/YN';

export interface Account {
  createdBy: string;
  createdTime: number;
  id: number;
  lastLoginIp: number | null;
  lastLoginTime: number | null;
  loginTimes: number | null;
  note: null | string;
  permission: { permissions: Permission[] };
  roleIds?: null | number[];
  roles: RoleResult[] | null;
  sysDefault: string;
  username: string;

  platformAdmin: YN;
  platformWx: YN;
  enabled: YN;
  accountNonExpired: YN;
  credentialsNonExpired: YN;
  accountNonLock: YN;
  lockTime: null;
  unlockTime: null;
  name: string;
  email: string | null;
  phone: string | null;
  openid: string | null;
}
export interface Permission {
  actionList: Action[] | null;
  children: Permission[] | null;
  id: number;
  parentId: number;
  permissionCode: string;
  permissionName: string;
  sortNum: number;
}
interface Action {
  actionCode: string;
  actionName: string;
  defaultCheck: YN;
  id: number;
  permissionId: number;
  requestList?: Array<any>;
  sortNum: number;
}
export type GetAccountWithLoggedModel = Account;
