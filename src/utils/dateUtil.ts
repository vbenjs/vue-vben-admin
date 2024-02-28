/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, { Dayjs } from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_CN_FORMAT = 'YYYY年MM月DD日';

export const dateUtil = dayjs;
export const today = dayjs();

export type Time = Dayjs | Date | string | number | undefined | null;
export function formatToDateTime(date: Time, formatStr = DATE_TIME_FORMAT): string {
  if (!date) return '';
  return dayjs(date).format(formatStr);
}

export function formatToDate(date: Time, formatStr = DATE_FORMAT): string {
  if (!date) return '';
  return dayjs(date).format(formatStr);
}
export const formatToDateCN = (date: Time, formatStr = DATE_CN_FORMAT) => {
  if (!date) return '';
  return dayjs(date).format(formatStr);
};

export const formatToDateRange = (range: [Time, Time], format = 'MM/DD', join = '-') => {
  return dayjs(range[0]).format(format) + join + dayjs(range[1]).format(format);
};
export const getDaysInMonth = (value: Time) => {
  return dayjs(value).daysInMonth();
};

export const getWeekRange: (num?: number, date?: Time) => [string, string] = (num = 0, date) => {
  const day = dayjs(date).day();
  const weekOfday = day === 0 ? 7 : day; // 计算是这周第几天
  const sunday = dayjs(date)
    .add(7 - weekOfday + 7 * num, 'day')
    .format('YYYY-MM-DD'); // 周日日期
  const monday = dayjs(date)
    .subtract(weekOfday - 1 - 7 * num, 'day')
    .format('YYYY-MM-DD'); // 周一日期
  return [monday, sunday];
};

export const getMonthRange: (date?: Time, format?: string) => [string, string] = (
  date,
  format = DATE_FORMAT,
) => {
  const year = dayjs(date).year();
  const month = dayjs(date).month();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  return [dayjs(monthStart).format(format), dayjs(monthEnd).format(format)];
};
export const getYearRange: (date: Time, format?: string) => [string, string] = (
  date,
  format = DATE_FORMAT,
) => {
  const year = dayjs(date).year();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  return [dayjs(yearStart).format(format), dayjs(yearEnd).format(format)];
};

export const isIncludeDateRange = (date: Time, range: [Time, Time]) => {
  return !dayjs(date).isBefore(range[0]) && dayjs(date).isBefore(dayjs(range[1]).add(1, 'day'));
};

export const getWeekOfDayCN = (date: Time) => {
  const weekArr = ['日', '一', '二', '三', '四', '五', '六'];
  const weekOfday = dayjs(date).day();
  return weekArr[weekOfday];
};
export const getRangeDays = (range: [Time, Time]) => {
  return dayjs(range[1]).diff(range[0], 'day');
};

export const formatTimeRangeStringToArray = (date: string) => {
  const range = date.replace(/\s*/g, '');
  return range.split('-');
};

export function addDay(num: number, date?: Time, unit?: dayjs.ManipulateType): Dayjs;
export function addDay(
  num: number,
  date: Time,
  unit?: dayjs.ManipulateType,
  format?: string,
): string;
export function addDay(
  num: number,
  date: Time = today,
  unit: dayjs.ManipulateType = 'day',
  format?: string,
) {
  if (format) return dayjs(date).add(num, unit).format(format);
  return dayjs(date).add(num, unit);
}

export const isSameDay = (day1: Time, day2?: Time, unit: dayjs.OpUnitType = 'day') => {
  return dayjs(formatToDate(day1)).isSame(formatToDate(day2), unit);
};
export const isBeforeDay = (day1: Time, day2: Time) => {
  return dayjs(day1).isBefore(day2);
};
export const isAfterDay = (day1: Time, day2: Time) => {
  return dayjs(day1).isAfter(day2);
};

export const dateDiff = (
  date1: Time,
  date2: Time,
  unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'date',
) => {
  return dayjs(date2).diff(dayjs(date1), unit);
};

export const formatLastTime = (date: Time) => {
  if (!date) return '无数据';
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;
  const diff = dayjs().diff(dayjs(date), 'second');
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < month) return `${Math.floor(diff / day)}天前`;
  if (diff < year) return `${Math.floor(diff / month)}月前`;
  return `${Math.floor(diff / year)}年前`;
};

export const formatLastTimeColor = (date: Time) => {
  if (!date) return 'warning';
  const minute = 60;
  const diff = dayjs().diff(dayjs(date), 'second');
  if (diff < minute * 10) return 'success';
  return 'warning';
};
