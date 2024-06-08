import dateFunc, { type ConfigType } from 'dayjs';

const DATE_TIME_TEMPLATE = 'YYYY-MM-DD HH:mm:ss';
const DATE_TEMPLATE = 'YYYY-MM-DD';

/**
 * @zh_CN 格式化日期时间
 * @param date 待格式化的日期时间
 * @param format 格式化的方式
 * @returns 格式化后的日期字符串，默认：YYYY-MM-DD HH:mm:ss
 */
function formatDate(date?: ConfigType, format = DATE_TEMPLATE): string {
  return dateFunc(date).format(format);
}

/**
 * @zh_CN 格式化日期时间
 * @param date 待格式化的日期时间
 * @returns 格式化后的日期字符串
 */
function formatDateTime(date?: ConfigType): string {
  return formatDate(date, DATE_TIME_TEMPLATE);
}

export { formatDate, formatDateTime };
