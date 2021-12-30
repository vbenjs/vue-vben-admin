/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export const dateUtil = dayjs

export const formatToDateTime = (
  date: ConfigType,
  format = DATE_TIME_FORMAT,
): string => {
  return dateUtil(date).format(format)
}

export const formatToDate = (
  date: ConfigType,
  format = DATE_FORMAT,
): string => {
  return dateUtil(date).format(format)
}
