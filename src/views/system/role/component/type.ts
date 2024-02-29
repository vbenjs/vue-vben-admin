import { PermissionTree } from '@/api/system/model/permissionModel';

export interface TreeData extends Omit<PermissionTree, 'children'> {
  hide?: boolean;
  checkedList?: number[];
  children?: TreeData[] | null;
}
