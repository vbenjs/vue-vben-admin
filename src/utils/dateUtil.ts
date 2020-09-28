import { isObject, isString } from '/@/utils/is';
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(date: moment.MomentInput = null): string {
  return moment(date).format(DATE_TIME_FORMAT);
}

export function formatToDate(date: moment.MomentInput = null): string {
  return moment(date).format(DATE_FORMAT);
}

export const formatAgo = (str: string | number) => {
  if (!str) return '';
  const date = new Date(Number(str));
  const time = new Date().getTime() - date.getTime(); // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return '';
  } else if (time / 1000 < 30) {
    return '刚刚';
  } else if (time / 1000 < 60) {
    return parseInt(String(time / 1000)) + '秒前';
  } else if (time / 60000 < 60) {
    return parseInt(String(time / 60000)) + '分钟前';
  } else if (time / 3600000 < 24) {
    return parseInt(String(time / 3600000)) + '小时前';
  } else if (time / 86400000 < 31) {
    return parseInt(String(time / 86400000)) + '天前';
  } else if (time / 2592000000 < 12) {
    return parseInt(String(time / 2592000000)) + '月前';
  } else {
    return parseInt(String(time / 31536000000)) + '年前';
  }
};
/**
 * @description: 格式化请求参数时间
 */
export function formatRequestDate(params: any) {
  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

export const dateUtil = moment;
