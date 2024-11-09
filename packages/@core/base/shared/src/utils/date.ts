import dayjs from 'dayjs';

export function formatDate(time: number | string, format = 'YYYY-MM-DD') {
  return dayjs(time).format(format);
}

export function formatDateTime(time: number | string) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}
