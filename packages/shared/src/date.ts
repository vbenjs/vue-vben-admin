import dateFn, { type ConfigType } from 'dayjs';

const DATE_TIME_TEMPLATE = 'YYYY-MM-DD HH:mm:ss';
const DATE_TEMPLATE = 'YYYY-MM-DD';

/**
 * 格式化时间为：YYYY-MM-DD HH:mm:ss 格式
 * @param date
 */
function formatDateTime(date?: ConfigType): string {
  return dateFn(date).format(DATE_TIME_TEMPLATE);
}

/**
 * 格式化时间
 * @param date
 * @param format 默认 YYYY-MM-DD
 */
function formatDate(date?: ConfigType, format = DATE_TEMPLATE): string {
  return dateFn(date).format(format);
}

export { dateFn, formatDate, formatDateTime };
