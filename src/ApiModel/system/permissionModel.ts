import { YN } from '@/enums/YN';

export interface PermissionTree {
  actionList: null | ActionList[];
  id: number;
  parentId: number;
  permissionCode: string;
  permissionName: string;
  sortNum: number;
  children?: PermissionTree[] | null;
}

export interface ActionList {
  actionCode: string;
  actionName: string;
  defaultCheck: YN;
  id: number;
  permissionId: number;
  requestList: null | string[];
  sortNum: number;
}
