import type { AxiosRequestConfig } from 'axios';
import { AXIOS_CACHE_KEY } from '/@/enums/cacheEnum';
import { isString, isPlainObject } from 'lodash-es';
import { getAuthCache, setAuthCache } from '/@/utils/auth';

export class AxiosCache {
  keyCached: Map<any, string>;
  constructor() {
    this.keyCached = new Map();
  }
  private serializeQueryArgs(config: AxiosRequestConfig): string {
    const { url, params, data } = config;
    const queryArgs = params || data;
    let serialized = '';
    if (isString(queryArgs)) {
      serialized = queryArgs;
    } else {
      const stringified = JSON.stringify(queryArgs, (key, value) =>
        isPlainObject(value)
          ? Object.keys(value)
              .sort()
              .reduce<any>((acc, key) => {
                acc[key] = (value as any)[key];
                return acc;
              }, {})
          : value,
      );
      serialized = stringified;
    }
    return url + serialized;
  }

  public getCache<T>(config: AxiosRequestConfig) {
    const key = this.serializeQueryArgs(config);
    const cache = getAuthCache(AXIOS_CACHE_KEY) as T;
    if (cache) {
      return cache[key];
    }
  }

  public setCache<T>(config: AxiosRequestConfig, value: Recordable) {
    const key = this.serializeQueryArgs(config);
    if (this.keyCached.get(key)) {
      return;
    }
    this.keyCached.set(key, key);
    const cache = (getAuthCache(AXIOS_CACHE_KEY) as T) || {};
    cache[key] = value;
    setAuthCache(AXIOS_CACHE_KEY, cache);
  }
}
