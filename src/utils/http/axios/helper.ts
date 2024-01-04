import { isObject, isString } from '@/utils/is';
import { useGlobSetting } from '@/hooks/setting';
import projectSetting from '@/settings/projectSetting';

const globSetting = useGlobSetting();

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

// Convert avatar image realtive path to url
export const getAvatarUrl = (relaPath: string | undefined) => {
  return relaPath
    ? globSetting.apiUrl + '/' + projectSetting.staticFileDirBackend + '/' + relaPath
    : '';
};

/**
 * 移除空值字段: 值为 '' | null | undefined | [] | {}
 */
export function removeEmptyValueKey(obj: any = {}) {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value && typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        delete obj[key]; // {}
      } else {
        removeEmptyValueKey(value);
      }
    }
    (value === '' || value === null || value === undefined || value.length === 0) &&
      delete obj[key];
  });
  return obj;
}
