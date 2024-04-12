/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import duration, { DurationUnitType } from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH小时mm分钟ss秒';

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

/**
 * 格式化时长
 * @param duration
 * @param format
 */
export const formatDuration = (duration: number, format: DurationUnitType = 'seconds') => {
  return dayjs.duration(duration, format).format(TIME_FORMAT);
};
