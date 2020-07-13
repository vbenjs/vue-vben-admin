import { userStore } from '@/store/modules/user';
import { permissionStore } from '@/store/modules/permission';
import { RoleEnum } from '@/enums/roleEnum';

/**
 * @description:  获取token
 */
export function getToken(): string {
  return userStore.getTokenState;
}

/**
 * @description:  获取角色
 */
export function getRole(): RoleEnum[] {
  return permissionStore.getRoleState;
}
