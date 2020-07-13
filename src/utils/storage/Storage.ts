import Encryption, { EncryptionParams } from '@/utils/cipher/aesEncryption';
import { storageCipher } from '@/settings/cipherSetting';
export interface CreateStorageParams extends EncryptionParams {
  storage: Storage;
  hasEncrypt: boolean;
}
export const createStorage = ({
  prefixKey = '',
  key = storageCipher.key,
  iv = storageCipher.iv,
  storage = sessionStorage,
  hasEncrypt = true,
} = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    console.error('hasEncrypt为true时key或者iv必须位16位');
    return;
  }
  const encryption = new Encryption({ key, iv });
  /**
   *缓存类
   *构造参数可以传入 sessionStorage,localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    private storage: Storage;
    private encryption: Encryption;
    private hasEncrypt: boolean;
    private prefixKey?: string;

    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.encryption = encryption;
      this.hasEncrypt = hasEncrypt;
      this.prefixKey = prefixKey;
    }

    getKey(key: string) {
      return `${this.prefixKey}${key}`;
    }

    /**
     *
     *  设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @expire 过期时间 单位秒
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = null) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      });
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      this.storage.setItem(this.getKey(key), stringifyValue);
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
        const decItem = this.hasEncrypt ? this.encryption.decryptByAES(item) : item;
        try {
          const data = JSON.parse(decItem);
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
     * @param day 过期时间
     * 如果过期时间未设置,默认管理浏览器自动删除
     * 例子:
     *  cookieData.set('name','value',)
     */
    setCookie(name: string, value: any, expire: number | null = null) {
      value = this.hasEncrypt ? this.encryption.encryptByAES(JSON.stringify(value)) : value;
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
          let message: any = null;
          const str = arr2[1];
          if (this.hasEncrypt && str) {
            message = this.encryption.decryptByAES(str);
            try {
              return JSON.parse(message);
            } catch (e) {
              return str;
            }
          }
          return str;
        }
      }
      return '';
    }

    /**
     * 根据cookie名字删除cookie
     * @param name cookie名字
     */
    removeCookie(key: string) {
      this.setCookie(this.getKey(key), 1, -1);
    }

    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        // @ts-ignore
        /* eslint-disable */
        for (let i = keys.length; i--; ) {
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
      }
    }
  };
  return new WebStorage();
};
