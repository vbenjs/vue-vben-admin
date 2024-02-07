import { Persistent, BasicKeys } from '@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import sha256 from 'crypto-js/sha256';
import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
import { UserInfo } from '#/store';
import { useUserStore } from '@/store/modules/user';
import { usePermission } from '@/hooks/web/usePermission';
import { isString } from '@/utils/is';
import { SmartAuth } from '#/utils';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

/**
 * 创建密码
 * @param username
 * @param password
 */
export const createPassword = (username: string, password: string) => {
  return sha256(sha256(`${username}${password}888888$#@`)).toString();
};

/**
 * 是否是超级管理员
 */
export const isSuperAdmin = (): boolean => {
  const userStore = useUserStore();
  return userStore.getRoleList.includes('SUPERADMIN');
};

/**
 * 是否拥有权限
 * @param auth
 */
export const hasPermission = (auth?: SmartAuth | string): boolean => {
  if (!auth) {
    return true;
  }
  const { hasPermission } = usePermission();
  if (isString(auth)) {
    return hasPermission(auth);
  }
  const { permission, multipleMode } = auth;
  if (isString(permission)) {
    return hasPermission(permission);
  }
  if (multipleMode === 'or') {
    return permission.some((item) => hasPermission(item));
  } else {
    return permission.every((item) => hasPermission(item));
  }
};

/**
 * 申请临时 token
 * @param resource 申请资源
 * @param once 是否只使用一次
 */
export const applyTempToken = async (resource: string, once = true): Promise<string> => {
  return await defHttp.post({
    service: ApiServiceEnum.SMART_AUTH,
    url: 'auth/tempToken/apply',
    data: { resource, once },
  });
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo => {
  const userStore = useUserStore();
  return userStore.getUserInfo;
};

/**
 * 获取当前用户ID
 */
export const getCurrentUserId = (): string | number => {
  return getUserInfo().userId;
};

export const getUserRole = (): string[] => {
  const userStore = useUserStore();
  return userStore.getRoleList;
};
