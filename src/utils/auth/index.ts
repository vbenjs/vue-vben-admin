import { Persistent, BasicKeys } from '@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import sha256 from 'crypto-js/sha256';

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
