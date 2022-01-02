import { format, transports, loggers } from 'winston'
import { join } from 'path'
import { loadEnv, isProd } from '../../utils/env'
import 'winston-daily-rotate-file'
import chalk from 'chalk'
import dayjs from 'dayjs'

loadEnv()

const { APP_LOGGER_PATH, LOGGER_OUTPUT_ENABLE } = process.env

const { combine, colorize, label, timestamp, prettyPrint, simple, ms } = format

// 是否输出到文件
const enableOutFile = LOGGER_OUTPUT_ENABLE === 'true'

const devConsoleFormat = format.printf(({ timestamp, level, message, ms }) => {
  const formattedDate = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  const log = `[${level}] ${formattedDate} - ${message} ${chalk.yellow(ms)}`
  return log
})

const getLogDir = (dir: string) => {
  return APP_LOGGER_PATH
    ? APP_LOGGER_PATH + dir
    : join(process.cwd(), 'logs' + dir)
}

const createConsoleTransport = () => {
  return new transports.Console({
    handleExceptions: true,
    format: combine(
      colorize(),
      ms(),
      label(),
      timestamp(),
      prettyPrint(),
      simple(),
      devConsoleFormat,
    ),
    level: isProd ? 'info' : 'debug',
  })
}

const createTransport = (name = 'app', handleExceptions = false) => {
  return new transports.DailyRotateFile({
    filename: getLogDir(`/${name}/${name}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: 1024 * 1024 * 10, // 10m
    maxFiles: '30d',
    json: false,
    handleExceptions,
  })
}

const basicOptions = {
  level: 'debug',
  format: format.json(),
  // exceptions 是否会出导致 process.exit, 设为false不会
  exitOnError: false,
  // 为true时所有日志不输出
  silent: false,
}

function createOptions(name: string) {
  return {
    ...basicOptions,
    transports: [
      createConsoleTransport(),
      ...(enableOutFile ? [createTransport(name)] : []),
    ],
  }
}

loggers.add('gtt', createOptions('gtt'))
loggers.add('access', createOptions('access'))
loggers.add('error', createOptions('error'))

const appLogger = loggers.get('app')
const accessLogger = loggers.get('access')
const errorLogger = loggers.get('error')

export class Logger {
  static error(args) {
    errorLogger.error(args)
  }

  static debug(args) {
    appLogger.debug(args)
  }

  static warn(args) {
    appLogger.warn(args)
  }

  static info(args) {
    appLogger.info(args)
  }

  static access(args) {
    accessLogger.info(args)
  }
}
