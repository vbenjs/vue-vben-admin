import { DEFAULT_CACHE_TIME } from '../../settings/encryptionSetting';
import { getStorageShortName } from '/@/utils/helper/envHelper';
import { cacheCipher } from '/@/settings/encryptionSetting';
import Encryption from '/@/utils/encryption/aesEncryption';

export default class WebCookie {
  private encryption: Encryption;
  private hasEncrypt: boolean;

  constructor(hasEncrypt = true, key = cacheCipher.key, iv = cacheCipher.iv) {
    const encryption = new Encryption({ key, iv });
    this.encryption = encryption;
    this.hasEncrypt = hasEncrypt;
  }

  private getKey(key: string) {
    return `${getStorageShortName()}${key}`.toUpperCase();
  }

  /**
   * Add cookie
   * @param name cookie key
   * @param value cookie value
   * @param expire
   * If the expiration time is not set, the default management browser will automatically delete
   * e.g:
   *  cookieData.set('name','value',)
   */
  setCookie(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
    value = this.hasEncrypt ? this.encryption.encryptByAES(JSON.stringify(value)) : value;
    document.cookie = this.getKey(key) + '=' + value + '; Max-Age=' + expire;
  }

  /**
   * Get the cook value according to the key
   * @param key cookie key
   */
  getCookie(key: string) {
    const arr = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i++) {
      const arr2 = arr[i].split('=');
      if (arr2[0] === this.getKey(key)) {
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
   * Delete cookie based on cookie key
   * @param key cookie key
   */
  removeCookie(key: string) {
    this.setCookie(key, 1, -1);
  }

  /**
   * clear cookie
   */
  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
      }
    }
  }
}
