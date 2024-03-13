import { PermissionTree } from '@/ApiModel/system/permissionModel';

export interface TreeData extends Omit<PermissionTree, 'children'> {
  hide?: boolean;
  checkedList?: number[];
  children?: TreeData[] | null;
}
