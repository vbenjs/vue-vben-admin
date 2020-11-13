import { DEFAULT_CACHE_TIME } from '/@/settings/cipherSetting';

// import { EncryptionParams } from '/@/utils/cipher/aesEncryption';
export interface CreateStorageParams {
  storage: Storage;
  hasEncrypt: boolean;
}
export const createStorage = ({ prefixKey = '', storage = sessionStorage } = {}) => {
  /**
   *缓存类
   *构造参数可以传入 sessionStorage,localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    private storage: Storage;
    private prefixKey?: string;

    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     *
     *  设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @expire 过期时间 单位秒
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      });
      this.storage.setItem(this.getKey(key), stringData);
    }

    /**
     *
     *读取缓存
     * @param {string} key 缓存键
     * @returns 缓存值
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const item = this.storage.getItem(this.getKey(key));
      if (item) {
        try {
          const data = JSON.parse(item);
          const { value, expire } = data;
          if (expire === null || expire >= new Date().getTime()) {
            return value;
          }
          this.remove(this.getKey(key));
        } catch (e) {
          return def;
        }
      }
      return def;
    }

    /**
     *
     *删除缓存
     * @param {string} key 缓存键
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     *
     *删除该实例所有缓存
     * @memberof Cache
     */
    clear(): void {
      this.storage.clear();
    }

    /**
     * 添加cookie
     * @param name cookie名字
     * @param value cookie内容
     * @param expire
     * 如果过期时间未设置,默认管理浏览器自动删除
     * 例子:
     *  cookieData.set('name','value',)
     */
    setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
      document.cookie = this.getKey(name) + '=' + value + '; Max-Age=' + expire;
    }

    /**
     * 根据名字获取cooki值
     * @param name cookie名
     * @returns {*} cookie值
     */
    getCookie(name: string) {
      const arr = document.cookie.split('; ');
      for (let i = 0; i < arr.length; i++) {
        const arr2 = arr[i].split('=');
        if (arr2[0] === this.getKey(name)) {
          return arr2[1];
        }
      }
      return '';
    }

    /**
     * 根据cookie名字删除cookie
     * @param name cookie名字
     */
    removeCookie(key: string) {
      this.setCookie(key, 1, -1);
    }

    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (let i = keys.length; i--; ) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      }
    }
  };
  return new WebStorage();
};
