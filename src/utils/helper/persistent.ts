import { createStorage } from '/@/utils/storage';
import { isIeFn } from '/@/utils/browser';

import { BASE_LOCAL_CACHE_KEY, BASE_SESSION_CACHE_KEY } from '/@/enums/cacheEnum';

const ls = createStorage(localStorage);
const ss = createStorage();

interface CacheStore {
  local?: any;
  session?: any;
}

/**
 * @description:  Persistent cache
 */
const cacheStore: CacheStore = {
  // localstorage cache
  local: {},
  // sessionstorage cache
  session: {},
};

function initCache() {
  cacheStore.local = ls.get(BASE_LOCAL_CACHE_KEY) || {};
  cacheStore.session = ss.get(BASE_SESSION_CACHE_KEY) || {};
}
initCache();

export function setLocal(key: string, value: any, immediate = false) {
  cacheStore.local[BASE_LOCAL_CACHE_KEY] = cacheStore.local[BASE_LOCAL_CACHE_KEY] || {};
  cacheStore.local[BASE_LOCAL_CACHE_KEY][key] = value;
  if (immediate) {
    const localCache = cacheStore.local;
    ls.set(BASE_LOCAL_CACHE_KEY, localCache);
  }
}

export function getLocal<T>(key: string): T | null {
  try {
    return cacheStore.local[BASE_LOCAL_CACHE_KEY][key];
  } catch (error) {
    return null;
  }
}
export function removeLocal(key: string) {
  if (cacheStore.local[BASE_LOCAL_CACHE_KEY]) {
    Reflect.deleteProperty(cacheStore.local[BASE_LOCAL_CACHE_KEY], key);
  }
}

export function clearLocal() {
  cacheStore.local = {};
}

export function setSession(key: string, value: any, immediate = false) {
  cacheStore.session[BASE_SESSION_CACHE_KEY] = cacheStore.session[BASE_SESSION_CACHE_KEY] || {};
  cacheStore.session[BASE_SESSION_CACHE_KEY][key] = value;
  if (immediate) {
    const cache = cacheStore.session;
    ss.set(BASE_SESSION_CACHE_KEY, cache);
  }
}

export function removeSession(key: string) {
  if (cacheStore.session[BASE_SESSION_CACHE_KEY]) {
    Reflect.deleteProperty(cacheStore.session[BASE_SESSION_CACHE_KEY], key);
  }
}

export function getSession<T>(key: string): T | null {
  try {
    return cacheStore.session[BASE_SESSION_CACHE_KEY][key];
  } catch (error) {
    return null;
  }
}

export function clearSession() {
  cacheStore.session = {};
}

export function clearAll() {
  clearLocal();
  clearSession();
}

(() => {
  // /** Write to local before closing window */
  window.addEventListener('beforeunload', () => {
    const localCache = cacheStore.local;
    const sessionCache = cacheStore.session;

    // const ss = createStorage();

    ls.set(BASE_LOCAL_CACHE_KEY, localCache);
    ss.set(BASE_SESSION_CACHE_KEY, sessionCache);
  });

  function storageChange(e: any) {
    const { key, newValue, oldValue } = e;

    if (!key) {
      clearAll();
      return;
    }

    if (!!newValue && !!oldValue) {
      if (BASE_LOCAL_CACHE_KEY === key) {
        clearLocal();
      }
      if (BASE_SESSION_CACHE_KEY === key) {
        clearSession();
      }
    }
  }
  if (isIeFn() && (document as any).attachEvent) {
    (document as any).attachEvent('onstorage', storageChange);
  } else {
    window.addEventListener('storage', storageChange);
  }
})();
