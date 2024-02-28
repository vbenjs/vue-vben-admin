import { PermissionTree } from './permissionModel';
import { YN } from '@/enums/YN';

export interface RoleResult {
  code: string;
  id: number;
  name: string;
  note: null | string;
  permissions: null | PermissionTree[];
  sortNum: number;
  sysDefault: YN;
}
