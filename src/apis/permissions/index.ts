import { defHttp } from '/@/utils/http/axios';
import type TreeNode from '../TreeNode';
import type PermissionEntity from './PermissionEntity';

const domain = '/permissions';

export function listPermissionTree() {
  return defHttp.get<TreeNode[]>({ url: `${domain}/tree` });
}

export { PermissionEntity };
