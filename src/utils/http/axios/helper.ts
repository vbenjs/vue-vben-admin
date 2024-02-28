import { Encryption, EncryptionFactory } from '../../cipher';
import { SHOULD_ENABLE_STORAGE_ENCRYPTION } from '@/settings/encryptionSetting';
import { isObject, isString } from '@/utils/is';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T,
): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return;
  }

  for (const key in params) {
    const format = params[key]?.format ?? null;
    if (format && typeof format === 'function') {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

export class ApiEncryption {
  private encryption: Encryption;

  constructor() {
    this.encryption = EncryptionFactory.createAesEncryption();
  }

  encrypt(data: Object | string, contentType = 'application/json') {
    if (!SHOULD_ENABLE_STORAGE_ENCRYPTION) return data;
    if (contentType.indexOf('application/json') < 0) return data;
    let text = '';
    if (typeof data == 'object') {
      text = JSON.stringify(data);
    } else {
      text = data;
    }
    return this.encryption.encrypt(text);
  }

  decrypt(data: Object | string) {
    if (!SHOULD_ENABLE_STORAGE_ENCRYPTION) return data;
    if (typeof data == 'object') {
      return data;
    }
    if (typeof data == 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return JSON.parse(this.encryption.decrypt(data));
      }
    }
  }
}
