import { YN } from '@/enums/YN';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  code?: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  code: number;
  data: string | null;
  msg: null | string;
}

export interface LoginRecordResult {
  createdBy: string;
  createdTime: number;
  id: number;
  isSuccess: YN;
  loginIp: number;
  loginTime: number;
  msg?: null | string;
  username: string;
}
export interface QueryLoginRecordForm {
  username?: string;
}
